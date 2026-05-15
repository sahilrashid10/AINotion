using System;
using AINotion.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AINotion.Infrastructure.Persistence.Configurations;

public class WorkspaceConfiguration : IEntityTypeConfiguration<Workspace>
{
    public void Configure(EntityTypeBuilder<Workspace> builder)
    {
        builder.ToTable("Workspaces");

        builder.HasKey(workspace => workspace.Id);

        builder.Property(workspace => workspace.Id)
            .ValueGeneratedNever();

        builder.Property(workspace => workspace.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(workspace => workspace.Slug)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(workspace => workspace.Description)
            .HasMaxLength(1000);

        builder.Property(workspace => workspace.Icon)
            .HasMaxLength(500);

        builder.Property(workspace => workspace.Plan)
            .IsRequired()
            .HasMaxLength(50)
            .HasDefaultValue("free");

        builder.Property(workspace => workspace.AllowedDomains)
            .HasMaxLength(1000);

        builder.Property(workspace => workspace.IsPublic)
            .HasDefaultValue(false);

        builder.Property(workspace => workspace.CreatedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(workspace => workspace.IsDeleted)
            .HasDefaultValue(false);

        builder.HasIndex(workspace => workspace.Slug)
            .IsUnique()
            .HasDatabaseName("IX_Workspaces_Slug");

        builder.HasOne(workspace => workspace.Owner)
            .WithMany(user => user.OwnedWorkspaces)
            .HasForeignKey(workspace => workspace.OwnerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(workspace => workspace.Members)
            .WithOne(member => member.Workspace)
            .HasForeignKey(member => member.WorkspaceId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(workspace => workspace.Documents)
            .WithOne(document => document.Workspace)
            .HasForeignKey(document => document.WorkspaceId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(workspace => workspace.Invitations)
            .WithOne(invitation => invitation.Workspace)
            .HasForeignKey(invitation => invitation.WorkspaceId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(workspace => workspace.AuditLogs)
            .WithOne(auditLog => auditLog.Workspace)
            .HasForeignKey(auditLog => auditLog.WorkspaceId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}