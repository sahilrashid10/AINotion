using System;
using System.Threading.Tasks;
using AINotion.Domain.Entities;

namespace AINotion.Application.Interfaces.Repositories;

public interface IDocumentVersionRepository : IRepository<DocumentVersion>
{
    Task<DocumentVersion?> GetLatestForDocumentAsync(Guid documentId);
}
