using System;
using System.Threading.Tasks;
using AINotion.Domain.Entities;

namespace AINotion.Application.Interfaces.Repositories;

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByEmailAsync(string email);
}
