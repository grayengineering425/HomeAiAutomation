using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using GrayAutomationServer.Models;

namespace GrayAutomationServer.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class FrameController : Controller
	{
		private readonly FrameContext context;

		private String getEncodedImage(string path)
		{
			string baseImage = "";
			if (System.IO.File.Exists(path))
			{
				byte[] b = System.IO.File.ReadAllBytes(path);
				baseImage = "data:image/jpg;base64" + Convert.ToBase64String(b);
				//data:image/jpg;base64,
			}
			return baseImage;
		}

		public FrameController(FrameContext c)
		{
			context = c;

			if (context.Frames.Count() == 0)
			{
				context.Frames.Add(
					new Frame
					{
							TimeStamp = DateTime.Now
						,	Data = getEncodedImage("C:/Users/310262408/Desktop/test_faces/face0.jpg")
					}
				);
				context.Frames.Add(
					new Frame
					{
							TimeStamp = DateTime.Parse("06-03-1993 11:11 AM")
						,	Data = getEncodedImage("C:/Users/310262408/Desktop/test_faces/face1.jpg")
					}
				);
				context.Frames.Add(
					new Frame
					{
							TimeStamp = DateTime.Now
						,	Data = getEncodedImage("C:/Users/310262408/Desktop/test_faces/face2.jpg")
					}
				);
				context.Frames.Add(
					new Frame
					{
							TimeStamp = DateTime.Now
						,	Data = getEncodedImage("C:/Users/310262408/Desktop/test_faces/face3.jpg")
					}
				);
				context.Frames.Add(
					new Frame
					{
							TimeStamp = DateTime.Now
						,	Data = getEncodedImage("C:/Users/310262408/Desktop/test_faces/face4.jpg")
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

		// return all frames after a certain date
		// GET: api/Frame/GetBeforeDate
		[HttpGet("GetBeforeDate/{date}")]
		public async Task<ActionResult<IEnumerable<Frame>>> GetFramesBeforeDate(String date)
		{
			DateTime curTime;
			try
			{
				curTime = DateTime.ParseExact(date, "MM-dd-yyyy HH:mm tt", null);
			}
			catch (Exception /*e*/)
			{
				//handle or log exception
				return NotFound();
			}

			var frames = await context.Frames.
							Select(
								f => new Frame
								{
									Id			= f.Id
								,	TimeStamp	= f.TimeStamp
								,	Data		= f.Data
								}).
							Where
								(f => curTime.CompareTo(f.TimeStamp) < 0).ToListAsync();

			return frames;
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
