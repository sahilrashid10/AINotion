using System;
using System.Threading.Tasks;
using AINotion.Application.Interfaces.Repositories;
using AINotion.Domain.Entities;
using AINotion.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace AINotion.Infrastructure.Repositories;

public class InvitationRepository : GenericRepository<Invitation>, IInvitationRepository
{
    public InvitationRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Invitation?> GetByTokenAsync(string token)
    {
        return await _dbSet.FirstOrDefaultAsync(i => i.InvitationToken == token);
    }
}
