using System;
using AINotion.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AINotion.Infrastructure.Persistence.Configurations;

public class DocumentVersionConfiguration : IEntityTypeConfiguration<DocumentVersion>
{
    public void Configure(EntityTypeBuilder<DocumentVersion> builder)
    {
        builder.ToTable("DocumentVersions");

        builder.HasKey(version => version.Id);

        builder.Property(version => version.Id)
            .ValueGeneratedNever();

        builder.Property(version => version.VersionNumber)
            .IsRequired();

        builder.Property(version => version.ContentSnapshot)
            .IsRequired()
            .HasColumnType("text");

        builder.Property(version => version.ChangeDescription)
            .HasMaxLength(500);

        builder.Property(version => version.CreatedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasIndex(version => new { version.DocumentId, version.VersionNumber })
            .IsUnique()
            .HasDatabaseName("IX_DocumentVersions_DocumentId_VersionNumber");

        builder.HasOne(version => version.Document)
            .WithMany(document => document.Versions)
            .HasForeignKey(version => version.DocumentId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(version => version.ChangedByUser)
            .WithMany()
            .HasForeignKey(version => version.ChangedBy)
            .OnDelete(DeleteBehavior.SetNull);
    }
}