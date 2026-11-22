import path from 'node:path';
import fs from 'node:fs';

export const HARDHAT_RPC_URL = process.env.HARDHAT_RPC_URL || 'http://127.0.0.1:8545';
export const HARDHAT_CHAIN_ID = 31337;

// Contas conhecidas da rede de teste do Hardhat (EXCLUSIVAMENTE PARA AMBIENTE LOCAL DE TESTES)
export const LOCAL_DEV_ACCOUNTS = {
  admin: {
    address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' as `0x${string}`,
    privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80' as `0x${string}`,
    nome: 'Consórcio AcadChain (Admin)',
  },
  ufs: {
    address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8' as `0x${string}`,
    privateKey: '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d' as `0x${string}`,
    nome: 'Universidade Federal do Saber (UFS)',
    sigla: 'UFS',
    instituicaoId: 1,
  },
  itb: {
    address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC' as `0x${string}`,
    privateKey: '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a' as `0x${string}`,
    nome: 'Instituto Tecnológico do Brasil (ITB)',
    sigla: 'ITB',
    instituicaoId: 2,
  },
  pui: {
    address: '0x90F79bf6EB2c4f870365E785982E1f101E93b906' as `0x${string}`,
    privateKey: '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6' as `0x${string}`,
    nome: 'Pontifícia Universidade Integrada (PUI)',
    sigla: 'PUI',
    instituicaoId: 3,
  },
  hacker: {
    address: '0xa0Ee7A142d267C1f36714E4a8F75612F20a79720' as `0x${string}`,
    privateKey: '0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6' as `0x${string}`,
    nome: 'Conta Não Autorizada (Simulação de Invasor)',
    instituicaoId: 999,
  },
};

export interface ContractManifest {
  chainId: number;
  networkName: string;
  contractAddress: `0x${string}`;
  deployerAddress: string;
  deploymentBlock: number;
  deployedAt: string;
  issuers: {
    id: number;
    sigla: string;
    nome: string;
    address: string;
    role: string;
  }[];
  abi: any[];
}

export function loadManifest(): ContractManifest | null {
  const candidatePaths = [
    path.resolve(process.cwd(), '../dados/contract-manifest.json'),
    path.resolve(process.cwd(), 'dados/contract-manifest.json'),
    path.resolve(process.cwd(), 'src/config/contract-manifest.json'),
  ];

  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      try {
        const raw = fs.readFileSync(p, 'utf8');
        return JSON.parse(raw);
      } catch {
        // continua tentando outros caminhos
      }
    }
  }

  return null;
}
