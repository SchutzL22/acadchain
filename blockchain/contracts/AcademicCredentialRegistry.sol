// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title AcademicCredentialRegistry (v2.0)
 * @dev Registro descentralizado e compartilhado de atestações acadêmicas para o projeto AcadChain.
 *      Implementa modelo "Off-Chain Data, On-Chain Proofs":
 *      - Prova 1: canonicalHash (SHA-256 dos metadados acadêmicos canônicos estruturados)
 *      - Prova 2: fileHash (SHA-256 dos bytes físicos do arquivo PDF gerado pelo sistema)
 *      Nenhum dado pessoal sensível (nome, CPF, notas) é armazenado diretamente no ledger.
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
        bytes32 canonicalHash;     // Hash SHA-256 dos dados acadêmicos estruturados
        bytes32 fileHash;          // Hash SHA-256 dos bytes finais do PDF (se emitido)
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
    event CredentialIssuedWithFile(
        bytes32 indexed credentialId,
        bytes32 indexed canonicalHash,
        bytes32 indexed fileHash,
        address issuer,
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
        issuers[msg.sender] = IssuerInfo({
            isAuthorized: true,
            institutionName: "Consorcio AcadChain (Admin)",
            authorizedAt: block.timestamp
        });
        emit IssuerAuthorized(msg.sender, "Consorcio AcadChain (Admin)", msg.sender, block.timestamp);
    }

    // --- Gestão de Instituições do Consórcio ---

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

    function deauthorizeIssuer(address issuer) external onlyAdmin {
        if (!issuers[issuer].isAuthorized) revert IssuerNotAuthorized();

        issuers[issuer].isAuthorized = false;
        emit IssuerDeauthorized(issuer, msg.sender, block.timestamp);
    }

    function isIssuerAuthorized(address issuer) external view returns (bool) {
        return issuers[issuer].isAuthorized;
    }

    // --- Emissão e Registro de Credenciais ---

    /**
     * @notice Emite credencial com prova dos dados canônicos.
     */
    function issueCredential(bytes32 credentialId, bytes32 canonicalHash) external onlyAuthorizedIssuer {
        _issueInternal(credentialId, canonicalHash, bytes32(0));
        emit CredentialIssued(credentialId, canonicalHash, msg.sender, block.timestamp);
    }

    /**
     * @notice Emite credencial registrando tanto a prova dos dados canônicos quanto o hash do arquivo PDF binário.
     */
    function issueCredentialWithFile(
        bytes32 credentialId,
        bytes32 canonicalHash,
        bytes32 fileHash
    ) external onlyAuthorizedIssuer {
        _issueInternal(credentialId, canonicalHash, fileHash);
        emit CredentialIssuedWithFile(credentialId, canonicalHash, fileHash, msg.sender, block.timestamp);
    }

    function _issueInternal(bytes32 credentialId, bytes32 canonicalHash, bytes32 fileHash) internal {
        if (credentialId == bytes32(0)) revert EmptyIdentifier();
        if (canonicalHash == bytes32(0)) revert EmptyHash();
        if (_credentials[credentialId].status != CredentialStatus.NONE) {
            revert CredentialAlreadyExists(credentialId);
        }

        _credentials[credentialId] = Credential({
            credentialId: credentialId,
            canonicalHash: canonicalHash,
            fileHash: fileHash,
            issuer: msg.sender,
            issuedAt: block.timestamp,
            status: CredentialStatus.ISSUED,
            revokedAt: 0,
            revocationReason: ""
        });

        _allCredentialIds.push(credentialId);
        totalCredentialsIssued++;
    }

    // --- Consulta de Credenciais ---

    function getCredential(bytes32 credentialId)
        external
        view
        returns (
            bytes32 id,
            bytes32 canonicalHash,
            bytes32 fileHash,
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
            cred.fileHash,
            cred.issuer,
            cred.issuedAt,
            cred.status,
            cred.revokedAt,
            cred.revocationReason,
            issuers[cred.issuer].institutionName
        );
    }

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

    /**
     * @notice Verificação completa de dupla camada (dados canônicos + bytes do PDF).
     */
    function verifyCredentialFull(
        bytes32 credentialId,
        bytes32 claimedCanonicalHash,
        bytes32 claimedFileHash
    ) external view returns (bool isValid, bool isFileValid, string memory reason) {
        Credential memory cred = _credentials[credentialId];

        if (cred.status == CredentialStatus.NONE) {
            return (false, false, "Credencial nao encontrada no registro da blockchain");
        }

        if (cred.status == CredentialStatus.REVOKED) {
            return (false, false, "Credencial foi formalmente REVOGADA");
        }

        bool canonicalOk = (cred.canonicalHash == claimedCanonicalHash);
        bool fileOk = (cred.fileHash == bytes32(0) || cred.fileHash == claimedFileHash);

        if (!canonicalOk) {
            return (false, false, "ADULTERACAO DETECTADA nos dados estruturados da credencial");
        }

        if (!fileOk) {
            return (true, false, "ADULTERACAO DETECTADA no arquivo PDF fisico: os bytes foram modificados");
        }

        return (true, true, "Credencial autentica e arquivo PDF fisico integro e verificado");
    }

    // --- Revogação de Credenciais ---

    function revokeCredential(bytes32 credentialId, string calldata reason) external {
        Credential storage cred = _credentials[credentialId];

        if (cred.status == CredentialStatus.NONE) revert CredentialNotFound(credentialId);
        if (cred.status == CredentialStatus.REVOKED) revert CredentialAlreadyRevoked(credentialId);

        if (msg.sender != cred.issuer && msg.sender != admin) {
            revert UnauthorizedRevoker(msg.sender, cred.issuer);
        }

        cred.status = CredentialStatus.REVOKED;
        cred.revokedAt = block.timestamp;
        cred.revocationReason = reason;

        totalCredentialsRevoked++;

        emit CredentialRevoked(credentialId, msg.sender, reason, block.timestamp);
    }

    function getTotalCredentials() external view returns (uint256) {
        return _allCredentialIds.length;
    }

    function getAllCredentialIds() external view returns (bytes32[] memory) {
        return _allCredentialIds;
    }
}
