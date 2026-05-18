using System;
using System.Threading.Tasks;
using AINotion.Domain.Entities;

namespace AINotion.Application.Interfaces.Repositories;

public interface IDocumentRepository : IRepository<Document>
{
    Task<Document?> GetByIdWithVersionsAsync(Guid id);
}
