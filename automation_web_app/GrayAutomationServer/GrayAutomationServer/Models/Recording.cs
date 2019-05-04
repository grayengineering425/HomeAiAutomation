using System.Collections.Generic;

namespace GrayAutomationServer.Models
{
	public class Recording
	{
		public long Id				{ get; set; }
		public ICollection<Frame> Frames	{ get; set; }
	}
}
