using System;
using AINotion.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AINotion.Infrastructure.Persistence.Configurations;

public class WorkspaceMemberConfiguration : IEntityTypeConfiguration<WorkspaceMember>
{
    public void Configure(EntityTypeBuilder<WorkspaceMember> builder)
    {
        builder.ToTable("WorkspaceMembers");

        builder.HasKey(member => new { member.WorkspaceId, member.UserId });

        builder.Property(member => member.Role)
            .IsRequired()
            .HasMaxLength(50)
            .HasDefaultValue("member");

        builder.Property(member => member.JoinedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(member => member.IsActive)
            .HasDefaultValue(true);

        builder.HasOne(member => member.Workspace)
            .WithMany(workspace => workspace.Members)
            .HasForeignKey(member => member.WorkspaceId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(member => member.User)
            .WithMany(user => user.WorkspaceMemberships)
            .HasForeignKey(member => member.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}