namespace AINotion.Domain.Entities;

/// <summary>
/// Represents an audit log entry for tracking changes across the system.
/// All document mutations (create/edit/delete/share) are published to Kafka audit topic.
/// Append-only; never deleted. Includes actor, timestamp, action, and metadata.
/// </summary>
public class AuditLog
{
    public Guid Id { get; set; }

    public Guid ActorId { get; set; } // User who performed the action

    public Guid? WorkspaceId { get; set; }

    public string EntityType { get; set; } = string.Empty; // document, workspace, user, etc.

    public Guid? EntityId { get; set; } // ID of the entity being modified

    public string Action { get; set; } = string.Empty; // created, updated, deleted, shared, etc.

    public string? Metadata { get; set; } // JSON metadata (e.g., field changes, old vs new values)

    public string? IpAddress { get; set; }

    public string? UserAgent { get; set; }

    public DateTime Timestamp { get; set; }

    // Navigation properties
    public User? Actor { get; set; }

    public Workspace? Workspace { get; set; }
}
