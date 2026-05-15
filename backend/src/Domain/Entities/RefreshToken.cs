using System;

namespace AINotion.Domain.Entities;

/// <summary>
/// Represents a refresh token for JWT rotation.
/// Tokens support sliding expiry and rotation on every use.
/// Revoked tokens are stored in Redis blocklist with TTL equal to token expiry.
/// </summary>
public class RefreshToken
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public string TokenHash { get; set; } = string.Empty; // Hash of the actual token (never store plaintext)

    public DateTime ExpiresAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? RevokedAt { get; set; }

    public string? RevokedReason { get; set; }

    public bool IsRevoked { get; set; }

    public string? ReplacedByTokenHash { get; set; } // Token that replaced this one (rotation chain)

    // Navigation properties
    public User? User { get; set; }
}
