using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace GrayAutomationServer.Models
{
public class FrameContext : DbContext
{
	public FrameContext(DbContextOptions<FrameContext> options) : 
		base(options)
	{
	}

	public DbSet<Frame> Frames { get; set; }
}

}
