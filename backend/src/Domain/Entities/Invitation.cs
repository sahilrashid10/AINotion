namespace AINotion.Domain.Entities;

/// <summary>
/// Represents an invitation sent to a user to join a workspace.
/// Invitation tokens have expiry; once accepted, creates a WorkspaceMember entry.
/// </summary>
public class Invitation
{
    public Guid Id { get; set; }

    public Guid WorkspaceId { get; set; }

    public Guid SentBy { get; set; } // User who sent the invitation (admin/owner)

    public string Email { get; set; } = string.Empty; // Email of the invitee

    public Guid? InvitedUserId { get; set; } // If user already exists in system

    public string Role { get; set; } = "member"; // Role to be assigned: owner, admin, member, viewer

    public string InvitationToken { get; set; } = string.Empty; // Secure token for accepting invite

    public DateTime ExpiresAt { get; set; } // Invitation expiry

    public DateTime CreatedAt { get; set; }

    public DateTime? AcceptedAt { get; set; }

    public Guid? AcceptedBy { get; set; } // User who accepted the invitation

    public bool IsAccepted { get; set; }

    public bool IsExpired => DateTime.UtcNow > ExpiresAt && !IsAccepted;

    // Navigation properties
    public Workspace? Workspace { get; set; }

    public User? SentByUser { get; set; }

    public User? InvitedUser { get; set; }

    public User? AcceptedByUser { get; set; }
}
