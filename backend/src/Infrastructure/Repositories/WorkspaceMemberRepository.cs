using System;
using System.Threading.Tasks;
using AINotion.Application.Interfaces.Repositories;
using AINotion.Domain.Entities;
using AINotion.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace AINotion.Infrastructure.Repositories;

public class WorkspaceMemberRepository : GenericRepository<WorkspaceMember>, IWorkspaceMemberRepository
{
    public WorkspaceMemberRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<WorkspaceMember?> GetByWorkspaceAndUserAsync(Guid workspaceId, Guid userId)
    {
        return await _dbSet.FirstOrDefaultAsync(m => m.WorkspaceId == workspaceId && m.UserId == userId);
    }
}
