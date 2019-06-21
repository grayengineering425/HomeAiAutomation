#define _NO_ASYNCRTIMP

#include <iostream>
#include <string>
#include <thread>

#include "Alfred.h"

//TODO
#pragma warning ( push )
#pragma warning ( disable : 4099 )

int wmain()
{
	std::cout << "main: " << std::this_thread::get_id() << "\n";

	std::unique_ptr<Alfred> alfred = std::make_unique<Alfred>();

	alfred->wakeUp();
}

#pragma warning ( pop )