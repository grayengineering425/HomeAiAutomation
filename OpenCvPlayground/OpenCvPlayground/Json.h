#include <string>
#include <vector>
#include <memory>
#include <sstream>
#include <iostream>
#include <map>

class ItemInterface
{
public:
	ItemInterface() = default;

	std::map<std::string, std::shared_ptr<ItemInterface>> children;

	virtual std::string getValue() = 0;
};

template <class T>
class Item : public ItemInterface
{
public:
	Item(T &v);
	~Item() = default;

	virtual std::string getValue() override;

protected:
	std::string value;
};

class Json
{
public:
	Json() = default;
	~Json() = default;

	void addItem(std::string& name);

	template <class T>
	void addItem(std::string& name, T& item);

	template <class T>
	void addChildItem(std::string& parentName, std::string& name, T& item);

	void dump();
	std::string getEncodedJson() const;

private:
	void addChildren(std::string& name, std::shared_ptr<ItemInterface>& item, std::stringstream& ss);

private:
	std::string jsonMessage;
	std::map<std::string, std::shared_ptr<ItemInterface>> items;
};


//ITEM
template<class T>
Item<T>::Item(T & v)
{
	value = std::to_string(v);
}

template<>
Item<std::string>::Item(std::string& v)
{
	value = v;
}

template<class T>
inline std::string Item<T>::getValue()
{
	return value;
}


//JSON

inline void Json::addItem(std::string & name)
{
	if (items.find(name) != items.end()) return;

	std::string v = "";
	items[name] = std::make_shared<Item<std::string>>(v);
}

template<class T>
inline void Json::addItem(std::string & name, T & item)
{
	if (items.find(name) != items.end()) return;

	items[name] = std::make_shared<Item<T>>(item);
}

template<class T>
inline void Json::addChildItem(std::string & parentName, std::string & name, T & item)
{
	auto parent = items.find(parentName);
	if (parent == items.end()) return;

	if (auto parentItem = parent->second)
	{
		if (parentItem->children.find(name) != parentItem->children.end()) return;

		parentItem->children[name] = std::make_shared<Item<T>>(item);
	}
}

void Json::dump()
{
	jsonMessage.clear();

	std::stringstream ss;

	ss << "{";

	for (const auto& i : items)
	{
		auto name = i.first;
		auto item = i.second;

		if (!item) continue;

		if (item->children.empty()) ss << "\"" << name << "\": " << item->getValue() << "\", ";
		else addChildren(name, item, ss);
	}

	ss << "}";

	jsonMessage = ss.str();
}

inline std::string Json::getEncodedJson() const
{
	return jsonMessage;
}

inline void Json::addChildren(std::string& name, std::shared_ptr<ItemInterface>& item, std::stringstream& ss)
{
	ss << "\"" << name << "\":[ { ";

	for (const auto &c : item->children)
	{
		auto childName = c.first;
		auto childItem = c.second;

		if (!childItem) return;

		if (!childItem->children.empty()) addChildren(childName, childItem, ss);

		else
		{
			ss << "\"" << childName << "\": \"" << childItem->getValue() << "\", ";
		}
	}

	ss << "} ], ";
}