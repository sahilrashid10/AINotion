using System;
using AINotion.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AINotion.Infrastructure.Persistence.Configurations;

public class DocumentConfiguration : IEntityTypeConfiguration<Document>
{
    public void Configure(EntityTypeBuilder<Document> builder)
    {
        builder.ToTable("Documents");

        builder.HasKey(document => document.Id);

        builder.Property(document => document.Id)
            .ValueGeneratedNever();

        builder.Property(document => document.Title)
            .IsRequired()
            .HasMaxLength(250);

        builder.Property(document => document.Content)
            .IsRequired()
            .HasColumnType("text");

        builder.Property(document => document.ContentType)
            .HasMaxLength(100);

        builder.Property(document => document.CurrentVersion)
            .HasDefaultValue(1);

        builder.Property(document => document.IsEmbedded)
            .HasDefaultValue(false);

        builder.Property(document => document.CreatedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(document => document.IsDeleted)
            .HasDefaultValue(false);

        builder.HasOne(document => document.Workspace)
            .WithMany(workspace => workspace.Documents)
            .HasForeignKey(document => document.WorkspaceId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(document => document.CreatedByUser)
            .WithMany()
            .HasForeignKey(document => document.CreatedBy)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(document => document.Versions)
            .WithOne(version => version.Document)
            .HasForeignKey(version => version.DocumentId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}