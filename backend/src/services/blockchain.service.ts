import {
  createPublicClient,
  createWalletClient,
  http,
  getContract,
  keccak256,
  stringToHex,
  Address,
  Hash,
} from 'viem';
import { hardhat } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import {
  HARDHAT_RPC_URL,
  HARDHAT_CHAIN_ID,
  LOCAL_DEV_ACCOUNTS,
  loadManifest,
  ContractManifest,
} from '../config/blockchain.js';
import { getDatabase } from '../config/database.js';

export class BlockchainService {
  private static getPublicClient() {
    return createPublicClient({
      chain: hardhat,
      transport: http(HARDHAT_RPC_URL),
    });
  }

  /**
   * Consulta a saúde da rede Hardhat, status do nó e integridade do contrato.
   */
  public static async getNetworkStatus() {
    const publicClient = this.getPublicClient();

    try {
      const blockNumber = await publicClient.getBlockNumber();
      const chainId = await publicClient.getChainId();

      const manifest = loadManifest();

      if (!manifest || !manifest.contractAddress) {
        return {
          online: true,
          rpcUrl: HARDHAT_RPC_URL,
          chainId: Number(chainId),
          blocoAtual: Number(blockNumber),
          contratoImplantado: false,
          mensagem: 'Nó Hardhat conectado, mas nenhum manifesto de deploy foi encontrado.',
        };
      }

      // Verifica se existe bytecode no endereço indicado no manifesto
      const bytecode = await publicClient.getBytecode({
        address: manifest.contractAddress as Address,
      });

      if (!bytecode || bytecode === '0x') {
        return {
          online: true,
          rpcUrl: HARDHAT_RPC_URL,
          chainId: Number(chainId),
          blocoAtual: Number(blockNumber),
          contratoImplantado: false,
          redeReiniciada: true,
          mensagem:
            'Aviso de Rede Reiniciada: O nó Hardhat foi reiniciado e perdeu o contrato anterior. É necessário executar o deploy novamente.',
          contratoEsperado: manifest.contractAddress,
        };
      }

      // Consulta métricas on-chain
      let totalEmitidas = 0;
      let totalRevogadas = 0;

      try {
        const contract = getContract({
          address: manifest.contractAddress as Address,
          abi: manifest.abi,
          client: publicClient,
        });

        const emitidas = await contract.read.totalCredentialsIssued();
        const revogadas = await contract.read.totalCredentialsRevoked();
        totalEmitidas = Number(emitidas);
        totalRevogadas = Number(revogadas);
      } catch {
        // ABI ou leitura simplificada
      }

      return {
        online: true,
        rpcUrl: HARDHAT_RPC_URL,
        chainId: Number(chainId),
        blocoAtual: Number(blockNumber),
        contratoImplantado: true,
        contrato: {
          endereco: manifest.contractAddress,
          deployer: manifest.deployerAddress,
          blocoDeploy: manifest.deploymentBlock,
          dataDeploy: manifest.deployedAt,
          totalEmitidas,
          totalRevogadas,
        },
        instituicoesAutorizadas: manifest.issuers,
      };
    } catch (error: any) {
      return {
        online: false,
        rpcUrl: HARDHAT_RPC_URL,
        erro: 'Nó Hardhat local inacessível em ' + HARDHAT_RPC_URL,
        detalhes: error.message,
      };
    }
  }

  /**
   * Retorna os dados do manifesto do contrato.
   */
  public static getContractManifest(): ContractManifest | null {
    return loadManifest();
  }

  /**
   * Consulta uma credencial diretamente no contrato inteligente.
   */
  public static async getCredentialFromContract(credentialIdHex: `0x${string}`) {
    const manifest = loadManifest();
    if (!manifest) throw new Error('Contrato inteligente não configurado.');

    const publicClient = this.getPublicClient();
    const contract = getContract({
      address: manifest.contractAddress as Address,
      abi: manifest.abi,
      client: publicClient,
    });

    const res = (await contract.read.getCredential([credentialIdHex])) as any[];

    const statusMap = ['INEXISTENTE', 'EMITIDO', 'REVOGADO'];

    return {
      credentialId: res[0],
      canonicalHash: res[1],
      fileHash:
        res[2] && res[2] !== '0x0000000000000000000000000000000000000000000000000000000000000000'
          ? res[2]
          : null,
      issuerAddress: res[3],
      issuedAt: Number(res[4]),
      dataEmissaoFormatada: new Date(Number(res[4]) * 1000).toISOString(),
      statusCode: Number(res[5]),
      status: statusMap[Number(res[5])] || 'DESCONHECIDO',
      revokedAt: Number(res[6]) > 0 ? Number(res[6]) : null,
      dataRevogacaoFormatada:
        Number(res[6]) > 0 ? new Date(Number(res[6]) * 1000).toISOString() : null,
      revocationReason: res[7] || null,
      issuerName: res[8],
    };
  }

  /**
   * Valida a credencial contra a prova registrada no smart contract (camada canônica).
   */
  public static async verifyCredentialOnChain(
    credentialIdHex: `0x${string}`,
    claimedHashHex: `0x${string}`
  ) {
    const manifest = loadManifest();
    if (!manifest) {
      return {
        isValid: false,
        motivo: 'Contrato inteligente não está implantado ou manifesto indisponível.',
      };
    }

    const publicClient = this.getPublicClient();
    const contract = getContract({
      address: manifest.contractAddress as Address,
      abi: manifest.abi,
      client: publicClient,
    });

    try {
      const res = (await contract.read.verifyCredential([
        credentialIdHex,
        claimedHashHex,
      ])) as [boolean, string];

      return {
        isValid: res[0],
        motivo: res[1],
      };
    } catch (err: any) {
      return {
        isValid: false,
        motivo: `Erro ao consultar contrato: ${err.message}`,
      };
    }
  }

  /**
   * Valida a credencial contra dupla prova no smart contract: metadados canônicos + bytes do PDF.
   */
  public static async verifyCredentialFullOnChain(
    credentialIdHex: `0x${string}`,
    claimedCanonicalHashHex: `0x${string}`,
    claimedFileHashHex: `0x${string}`
  ) {
    const manifest = loadManifest();
    if (!manifest) {
      return {
        isValid: false,
        isFileValid: false,
        motivo: 'Contrato inteligente não está implantado ou manifesto indisponível.',
      };
    }

    const publicClient = this.getPublicClient();
    const contract = getContract({
      address: manifest.contractAddress as Address,
      abi: manifest.abi,
      client: publicClient,
    });

    try {
      const res = (await contract.read.verifyCredentialFull([
        credentialIdHex,
        claimedCanonicalHashHex,
        claimedFileHashHex,
      ])) as [boolean, boolean, string];

      return {
        isValid: res[0],
        isFileValid: res[1],
        motivo: res[2],
      };
    } catch (err: any) {
      return {
        isValid: false,
        isFileValid: false,
        motivo: `Erro ao consultar contrato: ${err.message}`,
      };
    }
  }

  /**
   * Emite uma credencial acadêmica com transação real na blockchain (suporta hash do PDF).
   */
  public static async issueCredentialOnChain(
    uuid: string,
    canonicalHashHex: `0x${string}`,
    instituicaoId: number,
    fileHashHex?: `0x${string}`
  ) {
    const manifest = loadManifest();
    if (!manifest) throw new Error('Smart contract não configurado.');

    // Seleciona a conta emissora autorizada
    const accountInfo = this.getIssuerAccount(instituicaoId);
    if (!accountInfo) {
      throw new Error(`Nenhuma conta emissora configurada para a instituição ${instituicaoId}`);
    }

    const account = privateKeyToAccount(accountInfo.privateKey);
    const publicClient = this.getPublicClient();
    const walletClient = createWalletClient({
      account,
      chain: hardhat,
      transport: http(HARDHAT_RPC_URL),
    });

    const credentialId = keccak256(stringToHex(uuid.toLowerCase().trim()));

    // Envia transação: com ou sem fileHash
    let hash: Hash;
    if (
      fileHashHex &&
      fileHashHex !== '0x' &&
      fileHashHex !== '0x0000000000000000000000000000000000000000000000000000000000000000'
    ) {
      hash = await walletClient.writeContract({
        address: manifest.contractAddress as Address,
        abi: manifest.abi,
        functionName: 'issueCredentialWithFile',
        args: [credentialId, canonicalHashHex, fileHashHex],
      });
    } else {
      hash = await walletClient.writeContract({
        address: manifest.contractAddress as Address,
        abi: manifest.abi,
        functionName: 'issueCredential',
        args: [credentialId, canonicalHashHex],
      });
    }

    // Aguarda confirmação do bloco
    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    // Registra na auditoria e atualiza SQLite
    const db = getDatabase();
    db.prepare(`
      UPDATE documentos 
      SET tx_hash_blockchain = ?,
          bloco_blockchain = ?,
          smart_contract_address = ?,
          endereco_emissor_blockchain = ?,
          status_sincronizacao = 'CONFIRMADO_ONCHAIN'
      WHERE uuid_publico = ?
    `).run(hash, Number(receipt.blockNumber), manifest.contractAddress, account.address, uuid);

    const docId = (db.prepare('SELECT id FROM documentos WHERE uuid_publico = ?').get(uuid) as any)?.id;

    db.prepare(`
      INSERT INTO transacoes_blockchain (documento_id, tipo_operacao, tx_hash, bloco, de_endereco, para_endereco, status, detalhes)
      VALUES (?, 'EMISSAO', ?, ?, ?, ?, 'CONFIRMADA', ?)
    `).run(
      docId || null,
      hash,
      Number(receipt.blockNumber),
      account.address,
      manifest.contractAddress,
      `Emissão confirmada da credencial ${uuid}`
    );

    return {
      sucesso: true,
      txHash: hash,
      bloco: Number(receipt.blockNumber),
      credentialId,
      canonicalHash: canonicalHashHex,
      fileHash: fileHashHex || null,
      emissor: account.address,
      gasUsado: receipt.gasUsed.toString(),
    };
  }

  /**
   * Revoga uma credencial formalmente com transação real na blockchain.
   */
  public static async revokeCredentialOnChain(
    uuid: string,
    reason: string,
    instituicaoId: number
  ) {
    const manifest = loadManifest();
    if (!manifest) throw new Error('Smart contract não configurado.');

    const accountInfo = this.getIssuerAccount(instituicaoId);
    if (!accountInfo) {
      throw new Error(`Instituição ${instituicaoId} sem conta configurada.`);
    }

    const account = privateKeyToAccount(accountInfo.privateKey);
    const publicClient = this.getPublicClient();
    const walletClient = createWalletClient({
      account,
      chain: hardhat,
      transport: http(HARDHAT_RPC_URL),
    });

    const credentialId = keccak256(stringToHex(uuid.toLowerCase().trim()));

    const hash = await walletClient.writeContract({
      address: manifest.contractAddress as Address,
      abi: manifest.abi,
      functionName: 'revokeCredential',
      args: [credentialId, reason],
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    const db = getDatabase();
    db.prepare(`
      UPDATE documentos 
      SET status = 'REVOGADO',
          status_sincronizacao = 'REVOGADO_ONCHAIN',
          revogado_em = CURRENT_TIMESTAMP,
          motivo_revogacao = ?
      WHERE uuid_publico = ?
    `).run(reason, uuid);

    const docId = (db.prepare('SELECT id FROM documentos WHERE uuid_publico = ?').get(uuid) as any)?.id;

    db.prepare(`
      INSERT INTO transacoes_blockchain (documento_id, tipo_operacao, tx_hash, bloco, de_endereco, para_endereco, status, detalhes)
      VALUES (?, 'REVOGACAO', ?, ?, ?, ?, 'CONFIRMADA', ?)
    `).run(
      docId || null,
      hash,
      Number(receipt.blockNumber),
      account.address,
      manifest.contractAddress,
      `Revogação: ${reason}`
    );

    return {
      sucesso: true,
      txHash: hash,
      bloco: Number(receipt.blockNumber),
      credentialId,
      motivo: reason,
      revogadoPor: account.address,
    };
  }

  /**
   * Retorna histórico de transações recentes do sistema.
   */
  public static getRecentTransactions(limit = 20) {
    const db = getDatabase();
    return db
      .prepare(`
      SELECT 
        tb.id,
        tb.tipo_operacao,
        tb.tx_hash,
        tb.bloco,
        tb.de_endereco,
        tb.para_endereco,
        tb.status,
        tb.detalhes,
        tb.criado_em,
        d.uuid_publico,
        d.titulo AS documento_titulo
      FROM transacoes_blockchain tb
      LEFT JOIN documentos d ON d.id = tb.documento_id
      ORDER BY tb.id DESC
      LIMIT ?
    `)
      .all(limit);
  }

  private static getIssuerAccount(instituicaoId: number) {
    if (instituicaoId === 1) return LOCAL_DEV_ACCOUNTS.ufs;
    if (instituicaoId === 2) return LOCAL_DEV_ACCOUNTS.itb;
    if (instituicaoId === 3) return LOCAL_DEV_ACCOUNTS.pui;
    if (instituicaoId === 0) return LOCAL_DEV_ACCOUNTS.admin;
    if (instituicaoId === 999) return LOCAL_DEV_ACCOUNTS.hacker;
    return null;
  }
}
