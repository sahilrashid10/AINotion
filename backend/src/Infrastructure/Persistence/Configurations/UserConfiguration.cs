using System;
using AINotion.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AINotion.Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
	public void Configure(EntityTypeBuilder<User> builder)
	{
		builder.ToTable("Users");

		builder.HasKey(user => user.Id);

		builder.Property(user => user.Id)
			.ValueGeneratedNever();

		builder.Property(user => user.Email)
			.IsRequired()
			.HasMaxLength(255);

		builder.Property(user => user.PasswordHash)
			.IsRequired()
			.HasMaxLength(512);

		builder.Property(user => user.FirstName)
			.IsRequired()
			.HasMaxLength(100);

		builder.Property(user => user.LastName)
			.IsRequired()
			.HasMaxLength(100);

		builder.Property(user => user.Avatar)
			.HasMaxLength(500);

		builder.Property(user => user.CreatedAt)
			.HasDefaultValueSql("CURRENT_TIMESTAMP");

		builder.Property(user => user.EmailVerified)
			.HasDefaultValue(false);

		builder.Property(user => user.IsDeleted)
			.HasDefaultValue(false);

		builder.HasIndex(user => user.Email)
			.IsUnique()
			.HasDatabaseName("IX_Users_Email");
	}
}
