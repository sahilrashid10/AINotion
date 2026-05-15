using System;

namespace AINotion.Domain.Entities;

/// <summary>
/// Represents a snapshot of a document at a specific version.
/// Auto-snapshots every 5 minutes during edit; retains last 50 versions; older versions archived to cold storage.
/// </summary>
public class DocumentVersion
{
    public Guid Id { get; set; }

    public Guid DocumentId { get; set; }

    public int VersionNumber { get; set; }

    public string ContentSnapshot { get; set; } = string.Empty;

    public Guid? ChangedBy { get; set; }

    public string? ChangeDescription { get; set; } // Brief description of what changed

    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public Document? Document { get; set; }

    public User? ChangedByUser { get; set; }
}
