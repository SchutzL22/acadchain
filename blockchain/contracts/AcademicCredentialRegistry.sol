// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title AcademicCredentialRegistry
 * @dev Registro descentralizado e compartilhado de atestações acadêmicas para o projeto AcadChain.
 *      Implementa modelo "Off-Chain Data, On-Chain Proofs": nenhum dado pessoal sensível (como
 *      nome, CPF ou notas) é armazenado na blockchain. Apenas identificadores e hashes criptográficos
 *      canônicos (SHA-256) são gravados de forma imutável e verificável.
 */
contract AcademicCredentialRegistry {
    // --- Tipos de Dados ---
    enum CredentialStatus {
        NONE,      // 0: Inexistente
        ISSUED,    // 1: Emitida e válida
        REVOKED    // 2: Revogada formalmente
    }

    struct Credential {
        bytes32 credentialId;      // Identificador unívoco derivado ou UUID hash
        bytes32 canonicalHash;     // Hash SHA-256 do conteúdo canônico do documento
        address issuer;            // Endereço da instituição emissora
        uint256 issuedAt;          // Timestamp do bloco de emissão
        CredentialStatus status;   // Estado atual da credencial
        uint256 revokedAt;         // Timestamp da revogação (se aplicável)
        string revocationReason;   // Motivo auditável da revogação
    }

    struct IssuerInfo {
        bool isAuthorized;         // Status de autorização no consórcio
        string institutionName;    // Nome ou sigla da instituição (ex: "UFS")
        uint256 authorizedAt;      // Data de credenciamento
    }

    // --- Estado do Contrato ---
    address public admin;
    uint256 public totalCredentialsIssued;
    uint256 public totalCredentialsRevoked;

    mapping(address => IssuerInfo) public issuers;
    mapping(bytes32 => Credential) private _credentials;
    bytes32[] private _allCredentialIds;

    // --- Eventos Auditáveis ---
    event IssuerAuthorized(address indexed issuer, string name, address indexed authorizedBy, uint256 timestamp);
    event IssuerDeauthorized(address indexed issuer, address indexed deauthorizedBy, uint256 timestamp);
    event CredentialIssued(
        bytes32 indexed credentialId,
        bytes32 indexed canonicalHash,
        address indexed issuer,
        uint256 issuedAt
    );
    event CredentialRevoked(
        bytes32 indexed credentialId,
        address indexed revokedBy,
        string reason,
        uint256 revokedAt
    );

    // --- Erros Customizados ---
    error OnlyAdminAllowed();
    error OnlyAuthorizedIssuerAllowed();
    error IssuerAlreadyAuthorized();
    error IssuerNotAuthorized();
    error CredentialAlreadyExists(bytes32 credentialId);
    error CredentialNotFound(bytes32 credentialId);
    error CredentialAlreadyRevoked(bytes32 credentialId);
    error UnauthorizedRevoker(address caller, address originalIssuer);
    error InvalidZeroAddress();
    error EmptyIdentifier();
    error EmptyHash();

    // --- Modificadores de Acesso ---
    modifier onlyAdmin() {
        if (msg.sender != admin) revert OnlyAdminAllowed();
        _;
    }

    modifier onlyAuthorizedIssuer() {
        if (!issuers[msg.sender].isAuthorized) revert OnlyAuthorizedIssuerAllowed();
        _;
    }

    constructor() {
        admin = msg.sender;
        // O administrador da rede também é registrado como emissor inicial com fins administrativos
        issuers[msg.sender] = IssuerInfo({
            isAuthorized: true,
            institutionName: "Consorcio AcadChain (Admin)",
            authorizedAt: block.timestamp
        });
        emit IssuerAuthorized(msg.sender, "Consorcio AcadChain (Admin)", msg.sender, block.timestamp);
    }

    // --- Gestão de Instituições do Consórcio ---

    /**
     * @notice Autoriza uma nova Instituição de Ensino Superior (IES) a emitir credenciais.
     * @param issuer Endereço Ethereum da carteira/servidor da instituição.
     * @param name Nome ou sigla oficial da instituição.
     */
    function authorizeIssuer(address issuer, string calldata name) external onlyAdmin {
        if (issuer == address(0)) revert InvalidZeroAddress();
        if (issuers[issuer].isAuthorized) revert IssuerAlreadyAuthorized();

        issuers[issuer] = IssuerInfo({
            isAuthorized: true,
            institutionName: name,
            authorizedAt: block.timestamp
        });

        emit IssuerAuthorized(issuer, name, msg.sender, block.timestamp);
    }

    /**
     * @notice Desautoriza uma IES do consórcio. Emissões históricas permanecem imutáveis.
     * @param issuer Endereço da instituição a ser descredenciada.
     */
    function deauthorizeIssuer(address issuer) external onlyAdmin {
        if (!issuers[issuer].isAuthorized) revert IssuerNotAuthorized();

        issuers[issuer].isAuthorized = false;
        emit IssuerDeauthorized(issuer, msg.sender, block.timestamp);
    }

    /**
     * @notice Verifica se determinado endereço é um emissor atualmente autorizado.
     */
    function isIssuerAuthorized(address issuer) external view returns (bool) {
        return issuers[issuer].isAuthorized;
    }

    // --- Emissão e Registro de Credenciais ---

    /**
     * @notice Emite e registra a prova criptográfica de uma credencial acadêmica.
     * @param credentialId Identificador criptográfico único de 32 bytes (ex: hash do UUID).
     * @param canonicalHash Hash SHA-256 calculado determinísticamente sobre os dados acadêmicos.
     */
    function issueCredential(bytes32 credentialId, bytes32 canonicalHash) external onlyAuthorizedIssuer {
        if (credentialId == bytes32(0)) revert EmptyIdentifier();
        if (canonicalHash == bytes32(0)) revert EmptyHash();
        if (_credentials[credentialId].status != CredentialStatus.NONE) {
            revert CredentialAlreadyExists(credentialId);
        }

        _credentials[credentialId] = Credential({
            credentialId: credentialId,
            canonicalHash: canonicalHash,
            issuer: msg.sender,
            issuedAt: block.timestamp,
            status: CredentialStatus.ISSUED,
            revokedAt: 0,
            revocationReason: ""
        });

        _allCredentialIds.push(credentialId);
        totalCredentialsIssued++;

        emit CredentialIssued(credentialId, canonicalHash, msg.sender, block.timestamp);
    }

    // --- Consulta de Credenciais ---

    /**
     * @notice Consulta todos os dados on-chain de uma credencial pelo seu identificador.
     */
    function getCredential(bytes32 credentialId)
        external
        view
        returns (
            bytes32 id,
            bytes32 canonicalHash,
            address issuer,
            uint256 issuedAt,
            CredentialStatus status,
            uint256 revokedAt,
            string memory revocationReason,
            string memory issuerName
        )
    {
        Credential memory cred = _credentials[credentialId];
        if (cred.status == CredentialStatus.NONE) revert CredentialNotFound(credentialId);

        return (
            cred.credentialId,
            cred.canonicalHash,
            cred.issuer,
            cred.issuedAt,
            cred.status,
            cred.revokedAt,
            cred.revocationReason,
            issuers[cred.issuer].institutionName
        );
    }

    /**
     * @notice Verifica se uma credencial está válida e se o hash apresentado coincide com a blockchain.
     * @param credentialId Identificador da credencial.
     * @param claimedHash Hash que o verificador recalculou a partir do documento apresentado.
     * @return isValid Verdadeiro se a credencial existe, está no status ISSUED e o hash coincide.
     * @return reason Explicação semântica do resultado.
     */
    function verifyCredential(bytes32 credentialId, bytes32 claimedHash)
        external
        view
        returns (bool isValid, string memory reason)
    {
        Credential memory cred = _credentials[credentialId];

        if (cred.status == CredentialStatus.NONE) {
            return (false, "Credencial nao encontrada no registro da blockchain");
        }

        if (cred.status == CredentialStatus.REVOKED) {
            return (false, "Credencial foi formalmente REVOGADA pela instituicao emissora");
        }

        if (cred.canonicalHash != claimedHash) {
            return (false, "ADULTERACAO DETECTADA: O hash calculado nao coincide com a prova registrada on-chain");
        }

        return (true, "Credencial autentica, valida e com integridade comprovada");
    }

    // --- Revogação de Credenciais ---

    /**
     * @notice Revoga uma credencial emitida. Apenas a instituição que emitiu originalmente ou o admin podem revogar.
     * @param credentialId Identificador da credencial.
     * @param reason Justificativa acadêmica ou legal da revogação.
     */
    function revokeCredential(bytes32 credentialId, string calldata reason) external {
        Credential storage cred = _credentials[credentialId];

        if (cred.status == CredentialStatus.NONE) revert CredentialNotFound(credentialId);
        if (cred.status == CredentialStatus.REVOKED) revert CredentialAlreadyRevoked(credentialId);

        // Apenas o emissor original ou o admin do consórcio podem revogar
        if (msg.sender != cred.issuer && msg.sender != admin) {
            revert UnauthorizedRevoker(msg.sender, cred.issuer);
        }

        cred.status = CredentialStatus.REVOKED;
        cred.revokedAt = block.timestamp;
        cred.revocationReason = reason;

        totalCredentialsRevoked++;

        emit CredentialRevoked(credentialId, msg.sender, reason, block.timestamp);
    }

    /**
     * @notice Retorna o total de credenciais registradas no histórico.
     */
    function getTotalCredentials() external view returns (uint256) {
        return _allCredentialIds.length;
    }

    /**
     * @notice Retorna a lista completa de IDs de credenciais emitidas.
     */
    function getAllCredentialIds() external view returns (bytes32[] memory) {
        return _allCredentialIds;
    }
}
