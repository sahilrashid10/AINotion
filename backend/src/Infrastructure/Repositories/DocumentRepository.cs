using System;
using System.Threading.Tasks;
using AINotion.Application.Interfaces.Repositories;
using AINotion.Domain.Entities;
using AINotion.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace AINotion.Infrastructure.Repositories;

public class DocumentRepository : GenericRepository<Document>, IDocumentRepository
{
    public DocumentRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Document?> GetByIdWithVersionsAsync(Guid id)
    {
        return await _dbSet.Include(d => d.Versions).FirstOrDefaultAsync(d => d.Id == id);
    }
}
