namespace AINotion.Domain.Entities;

/// <summary>
/// Represents a registered user in the system.
/// User data is workspace-independent; roles are defined per workspace.
/// </summary>
public class User
{
    public Guid Id { get; set; }

    public string Email { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string? Avatar { get; set; }

    public bool EmailVerified { get; set; }

    public DateTime? EmailVerifiedAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public bool IsDeleted { get; set; }

    public DateTime? DeletedAt { get; set; }

    // Navigation properties
    public ICollection<Workspace> OwnedWorkspaces { get; set; } = new List<Workspace>();

    public ICollection<WorkspaceMember> WorkspaceMemberships { get; set; } = new List<WorkspaceMember>();

    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();

    public ICollection<Invitation> InvitationsSent { get; set; } = new List<Invitation>();

    public ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();
}
