#include "ConnectionManager.h"
#include "FrameSocket.h"
#include "Scheduler.h"
#include "RestConnection.h"
#include "Frame.h"

ConnectionManager::ConnectionManager(Scheduler & scheduler)
	:	rest	(std::make_unique<RestConnection>	()			)
	, socket(std::make_unique<FrameSocket>(scheduler))
{
}

ConnectionManager::~ConnectionManager() = default;

void ConnectionManager::onNewFrame(const std::shared_ptr<Frame>& frame)
{
	//if (rest	) rest	->onNewFrame(frame);
	if (socket	) socket->onNewFrame(frame);
}
