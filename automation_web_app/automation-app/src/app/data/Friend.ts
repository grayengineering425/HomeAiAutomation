import { Face } from './Face';

export enum Relationship
{
		Friend
	,	Family
	,	Colleague
	,	Self
	,	NoRelation

};

export class Friend
{
	public id:				number;
	public name:			string;
	public relationship:	Relationship;
	public face:			Face;
	public encoding:		Array<number>;

	constructor(id: number, name: string, relationship: string, data: string, encoding: Array<number>)
	{
		this.id				= id;
		this.name			= name;
		this.face			= new Face(data, encoding);
		
		this.determineRelationship(relationship);
	}

	private determineRelationship(relationship: string): void
	{
		if (relationship.toLowerCase() == "friend"		)	this.relationship = Relationship.Friend;
		if (relationship.toLowerCase() == "family"		)	this.relationship = Relationship.Family;	else
		if (relationship.toLowerCase() == "colleague"	)	this.relationship = Relationship.Colleague; else
		if (relationship.toLowerCase() == "self"		)	this.relationship = Relationship.Self;
		else												this.relationship = Relationship.NoRelation;
	}
}