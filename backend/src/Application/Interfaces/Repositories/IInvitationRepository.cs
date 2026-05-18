using System;
using System.Threading.Tasks;
using AINotion.Domain.Entities;

namespace AINotion.Application.Interfaces.Repositories;

public interface IInvitationRepository : IRepository<Invitation>
{
    Task<Invitation?> GetByTokenAsync(string token);
}
