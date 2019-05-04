using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GrayAutomationServer.Models
{

public class Frame
{
	public long						Id				{ get; set; }
	public DateTime					TimeStamp		{ get; set; }
	public string					Data			{ get; set; }
	public ICollection<BoundingBox>	BoundingBoxes	{ get; set; }
}

}
