using Microsoft.EntityFrameworkCore;

namespace GrayAutomationServer.Models
{
	public class RecordingContext : DbContext
	{
		public RecordingContext(DbContextOptions<RecordingContext> options)
				: base(options)
		{
		}

		public DbSet<Recording> Recordings { get; set; }
	}
}
