#include "Scheduler.h"
#include "Eyes.h"

int main()
{
	Scheduler				s;
	std::unique_ptr<Eyes>	eyes = std::make_unique<Eyes>(s);

	if (eyes) eyes->open();

	s.wakeUp();
}