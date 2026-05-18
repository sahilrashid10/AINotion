using System;
using System.Threading.Tasks;
using AINotion.Application.Interfaces.Repositories;
using AINotion.Domain.Entities;
using AINotion.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace AINotion.Infrastructure.Repositories;

public class WorkspaceRepository : GenericRepository<Workspace>, IWorkspaceRepository
{
    public WorkspaceRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Workspace?> GetByNameAsync(string name, Guid ownerId)
    {
        return await _dbSet.FirstOrDefaultAsync(w => w.Name == name && w.OwnerId == ownerId);
    }
}
