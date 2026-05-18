using System;
using System.Threading.Tasks;
using AINotion.Domain.Entities;

namespace AINotion.Application.Interfaces.Repositories;

public interface IWorkspaceMemberRepository : IRepository<WorkspaceMember>
{
    Task<WorkspaceMember?> GetByWorkspaceAndUserAsync(Guid workspaceId, Guid userId);
}
