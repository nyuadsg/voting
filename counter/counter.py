
# Vote counting code for the ipad ballots
for i in ["f","s","j"]:
	fv="voted"+i+".txt"
	votedlog=open(fv).read().strip().split("\n")
	totalvotes=len(votedlog)
	f="results"+i+".txt"
	ballot=open(f).read().strip().split("\n")
	ballot=[x.split("|") for x in ballot]
	votedict={}
	for b in ballot:
		for c in b:
			if c in votedict.keys():
				votedict[c.strip()]+=1
			else:
				votedict[c.strip()]=0
	# Votes recorded by email, not voting booths:
	if i=="f":
		votedict["Farah Shamout"]+=1
		votedict["Maitha Al Mansoori"]+=1
		votedict["Lingliang Zhang"]+=1
		votedict["Theo Patrick Ntawiheba"]+=1
		totalvotes+=4
	if i=="j":
		votedict["Adam Dolan"]+=21
		votedict["No Vote"]+=1
		totalvotes+=22
	votes=[(x,votedict[x]) for x in votedict.keys()]
	votes.sort(key= lambda x: x[1], reverse=True)
	votes=[str(x[0])+" - "+str(x[1]) for x in votes]
	print str(totalvotes)+" votes counted for class: "+i+"\n"+"-"*30
	print "\n".join(votes)
	print "\n"












