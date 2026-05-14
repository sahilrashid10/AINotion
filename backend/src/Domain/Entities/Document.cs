namespace AINotion.Domain.Entities;

/// <summary>
/// Represents a document within a workspace.
/// Supports versioning, soft-delete, and embedding for AI features.
/// </summary>
public class Document
{
    public Guid Id { get; set; }

    public Guid WorkspaceId { get; set; }

    public Guid CreatedBy { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    public string? ContentType { get; set; } // MIME type if file-based

    public int CurrentVersion { get; set; } = 1;

    public bool IsEmbedded { get; set; } // Flag indicating if document has embeddings in pgvector

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? LastEditedAt { get; set; }

    public bool IsDeleted { get; set; } // Soft delete; recoverable for 30 days

    public DateTime? DeletedAt { get; set; }

    // Navigation properties
    public Workspace? Workspace { get; set; }

    public User? CreatedByUser { get; set; }

    public ICollection<DocumentVersion> Versions { get; set; } = new List<DocumentVersion>();
}
