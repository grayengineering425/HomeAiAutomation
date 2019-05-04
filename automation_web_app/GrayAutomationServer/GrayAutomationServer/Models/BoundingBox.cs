using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GrayAutomationServer.Models
{
	public class BoundingBox
	{
		public long Id			{ get; set; }
		public double X			{ get; set; }
		public double Y			{ get; set; }
		public double Width		{ get; set; }
		public double Height	{ get; set; }

	}
}
