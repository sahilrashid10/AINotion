using System;
using System.Threading.Tasks;
using AINotion.Domain.Entities;

namespace AINotion.Application.Interfaces.Repositories;

public interface IRefreshTokenRepository : IRepository<RefreshToken>
{
    Task<RefreshToken?> GetByTokenAsync(string token);
}
