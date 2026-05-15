using System;
using AINotion.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AINotion.Infrastructure.Persistence.Configurations;

public class InvitationConfiguration : IEntityTypeConfiguration<Invitation>
{
    public void Configure(EntityTypeBuilder<Invitation> builder)
    {
        builder.ToTable("Invitations");

        builder.HasKey(invitation => invitation.Id);

        builder.Property(invitation => invitation.Id)
            .ValueGeneratedNever();

        builder.Property(invitation => invitation.Email)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(invitation => invitation.Role)
            .IsRequired()
            .HasMaxLength(50)
            .HasDefaultValue("member");

        builder.Property(invitation => invitation.InvitationToken)
            .IsRequired()
            .HasMaxLength(512);

        builder.Property(invitation => invitation.CreatedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(invitation => invitation.IsAccepted)
            .HasDefaultValue(false);

        builder.HasIndex(invitation => invitation.InvitationToken)
            .IsUnique()
            .HasDatabaseName("IX_Invitations_InvitationToken");

        builder.HasOne(invitation => invitation.Workspace)
            .WithMany(workspace => workspace.Invitations)
            .HasForeignKey(invitation => invitation.WorkspaceId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(invitation => invitation.SentByUser)
            .WithMany(user => user.InvitationsSent)
            .HasForeignKey(invitation => invitation.SentBy)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(invitation => invitation.InvitedUser)
            .WithMany()
            .HasForeignKey(invitation => invitation.InvitedUserId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(invitation => invitation.AcceptedByUser)
            .WithMany()
            .HasForeignKey(invitation => invitation.AcceptedBy)
            .OnDelete(DeleteBehavior.SetNull);
    }
}