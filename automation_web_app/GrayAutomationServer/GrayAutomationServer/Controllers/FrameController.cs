using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using GrayAutomationServer.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace GrayAutomationServer.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class FrameController : Controller
	{
		private readonly FrameContext context;

		public FrameController(FrameContext c)
		{
			context = c;

			if (context.Frames.Count() == 0)
			{
				context.Frames.Add(
					new Frame
					{
							TimeStamp = DateTime.Now
						,	Data = "frame0.jpg"
					}
				);
				context.Frames.Add(
					new Frame
					{
							TimeStamp = DateTime.Now
						,	Data = "frame1.jpg"
					}
				);
				context.SaveChanges();
			}
		}

		// GET: api/Frame
		[HttpGet]
		public async Task<ActionResult<IEnumerable<Frame>>> GetFrames()
		{
			return await context.Frames.ToListAsync();
		}

		// GET: api/Frame/1
		[HttpGet("{id}")]
		public async Task<ActionResult<Frame>> GetFrame(long id)
		{
			var frame = await context.Frames.FindAsync(id);

			if (frame == null) return NotFound();

			return frame;
		}

		// POST: api/Frame
		[HttpPost]
		public async Task<ActionResult<Frame>> PostFrame(Frame frame)
		{
			context.Frames.Add(frame);
			await context.SaveChangesAsync();

			return CreatedAtAction("GetFrame", new { id = frame.Id }, frame);
		}
	}
}
