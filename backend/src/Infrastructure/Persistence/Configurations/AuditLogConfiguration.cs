using System;
using AINotion.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AINotion.Infrastructure.Persistence.Configurations;

public class AuditLogConfiguration : IEntityTypeConfiguration<AuditLog>
{
    public void Configure(EntityTypeBuilder<AuditLog> builder)
    {
        builder.ToTable("AuditLogs");

        builder.HasKey(auditLog => auditLog.Id);

        builder.Property(auditLog => auditLog.Id)
            .ValueGeneratedNever();

        builder.Property(auditLog => auditLog.EntityType)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(auditLog => auditLog.Action)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(auditLog => auditLog.Metadata)
            .HasColumnType("text");

        builder.Property(auditLog => auditLog.IpAddress)
            .HasMaxLength(45);

        builder.Property(auditLog => auditLog.UserAgent)
            .HasMaxLength(500);

        builder.Property(auditLog => auditLog.Timestamp)
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasIndex(auditLog => auditLog.ActorId)
            .HasDatabaseName("IX_AuditLogs_ActorId");

        builder.HasIndex(auditLog => auditLog.WorkspaceId)
            .HasDatabaseName("IX_AuditLogs_WorkspaceId");

        builder.HasIndex(auditLog => auditLog.Timestamp)
            .HasDatabaseName("IX_AuditLogs_Timestamp");

        builder.HasOne(auditLog => auditLog.Actor)
            .WithMany(user => user.AuditLogs)
            .HasForeignKey(auditLog => auditLog.ActorId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(auditLog => auditLog.Workspace)
            .WithMany(workspace => workspace.AuditLogs)
            .HasForeignKey(auditLog => auditLog.WorkspaceId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}