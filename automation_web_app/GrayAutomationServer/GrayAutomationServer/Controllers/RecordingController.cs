using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using GrayAutomationServer.Models;
using Newtonsoft.Json;

namespace GrayAutomationServer.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class RecordingController : Controller
	{
		private readonly RecordingContext context;

		private string getEncodedImage(int frameIndex)
		{
			string baseImage = "";

			string path = "C:/Users/310262408/Desktop/test_faces/face";
			path += frameIndex.ToString();
			path += ".jpg";

			if (System.IO.File.Exists(path))
			{
				byte[] b = System.IO.File.ReadAllBytes(path);
				baseImage = "data:image/jpg;base64," + Convert.ToBase64String(b);
				//data:image/jpg;base64,
			}
			return baseImage;
		}

		public RecordingController(RecordingContext c)
		{
			context = c;

			if (context.Recordings.Count() == 0)
			{
				Recording recording1 = new Recording
				{
					Frames = new List<Frame>()
				};

				Recording recording2 = new Recording
				{
					Frames = new List<Frame>()
				};

				for (int j = 0; j < 2; ++j)
					for (int i = 5 * j; i < (j + 1) * 5; ++i)
					{
						BoundingBox b = new BoundingBox
						{
							X = i
							, Y = i
							, Width = i
							, Height = i
						};

						Frame frame = new Frame
						{
							TimeStamp = DateTime.Now
							, Data = getEncodedImage(i)
							, BoundingBoxes = new List<BoundingBox>()
						};
						frame.BoundingBoxes.Add(b);

						if (i < 5) recording1.Frames.Add(frame);
						else recording2.Frames.Add(frame);
					}

				context.Recordings.Add(recording1);
				context.Recordings.Add(recording2);

				context.SaveChanges();
			}
		}

		// GET: api/Recording
		[HttpGet]
		public async Task<ActionResult<IEnumerable<Recording>>> GetRecordings()
		{
			return await context.Recordings.Include(r => r.Frames)
											.ThenInclude(f => f.BoundingBoxes)
											.AsNoTracking()
											.ToListAsync();
		}

		// GET: api/Recording/5
		[HttpGet("{id}")]
		public async Task<ActionResult<Recording>> GetRecording(string id)
		{
			var recording = await context.Recordings.FindAsync(id);

			if (recording == null) return NotFound();

			return recording;
		}

		//POST: api/Recording
		[HttpPost]
		public async Task<ActionResult<Recording>> PostRecording(Recording recording)
		{
			context.Recordings.Add(recording);
			await context.SaveChangesAsync();

			return CreatedAtAction("GetRecording", new { id = recording.Id }, recording);
		}

		//POST: api/Recording/5/Frame
		[HttpPost("{id}"), ActionName("Edit")]
		public async Task<ActionResult<Frame>> PostFrame(int? id, Frame frame)
		{
			Recording recording = context.Recordings.Include(r => r.Frames).ThenInclude(f => f.BoundingBoxes).FirstOrDefault(x => x.Id == id);

			if (recording != null)
			{
				try
				{
					recording.Frames.Add(frame);
				}
				catch
				{
					return NotFound();
				}

			}
			await context.SaveChangesAsync();

			return NoContent();
		}
	}
}
