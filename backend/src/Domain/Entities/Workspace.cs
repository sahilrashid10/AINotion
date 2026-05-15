using System;
using System.Collections.Generic;

namespace AINotion.Domain.Entities;

/// <summary>
/// Represents a collaborative workspace where teams create documents and collaborate.
/// All data is strictly scoped to a workspace; cross-workspace access is forbidden.
/// </summary>
public class Workspace
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Slug { get; set; } = string.Empty; // URL-friendly identifier; must be unique

    public string? Description { get; set; }

    public string? Icon { get; set; }

    public Guid OwnerId { get; set; }

    public string Plan { get; set; } = "free"; // free, pro, enterprise

    public string? AllowedDomains { get; set; } // Comma-separated list of email domains allowed to join

    public bool IsPublic { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public bool IsDeleted { get; set; }

    public DateTime? DeletedAt { get; set; }

    // Navigation properties
    public User? Owner { get; set; }

    public ICollection<WorkspaceMember> Members { get; set; } = new List<WorkspaceMember>();

    public ICollection<Document> Documents { get; set; } = new List<Document>();

    public ICollection<Invitation> Invitations { get; set; } = new List<Invitation>();

    public ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();
}
