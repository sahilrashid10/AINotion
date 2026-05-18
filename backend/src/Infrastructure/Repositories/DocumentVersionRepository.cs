using System;
using System.Linq;
using System.Threading.Tasks;
using AINotion.Application.Interfaces.Repositories;
using AINotion.Domain.Entities;
using AINotion.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace AINotion.Infrastructure.Repositories;

public class DocumentVersionRepository : GenericRepository<DocumentVersion>, IDocumentVersionRepository
{
    public DocumentVersionRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<DocumentVersion?> GetLatestForDocumentAsync(Guid documentId)
    {
        return await _dbSet.Where(v => v.DocumentId == documentId).OrderByDescending(v => v.VersionNumber).FirstOrDefaultAsync();
    }
}
