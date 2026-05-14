namespace AINotion.Domain.Entities;

/// <summary>
/// Represents a user's membership in a workspace with assigned role.
/// Roles are workspace-specific (not global): owner, admin, member, viewer.
/// </summary>
public class WorkspaceMember
{
    public Guid WorkspaceId { get; set; }

    public Guid UserId { get; set; }

    public string Role { get; set; } = "member"; // owner, admin, member, viewer

    public DateTime JoinedAt { get; set; }

    public DateTime? RemovedAt { get; set; }

    public bool IsActive { get; set; } = true;

    // Navigation properties
    public Workspace? Workspace { get; set; }

    public User? User { get; set; }
}
