using System;
using System.Threading.Tasks;
using AINotion.Application.Interfaces.Repositories;
using AINotion.Domain.Entities;
using AINotion.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace AINotion.Infrastructure.Repositories;

public class UserRepository : GenericRepository<User>, IUserRepository
{
    public UserRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _dbSet.FirstOrDefaultAsync(u => u.Email == email);
    }
}
