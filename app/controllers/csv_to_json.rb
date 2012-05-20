require 'rubygems'
require 'json'
require 'all_data.rb'

class CsvToJson

  @@depth_limit = 2 
  
  def initialize(text, kunta_data)
  	@model = {}
  	@votes_model = []
  	@counter = 0
  	@blacklist = {}
  	@all_municipals = []
	@kunnat = {}
  	
  	if kunta_data.respond_to? "each_line"
  		kunta_data.each_line do |line|
  			kunta = {}
  			f = line.split(";")
			kunta["pinta_ala"] = f[1]
			kunta["taajama_aste"] = f[2]
			kunta["asukasluku"] = f[3]
			
			@kunnat[f[0]] = kunta
  		end
  	end
  	
    if text.respond_to? "each_line"
  		text.each_line do |obj|
  			temp = {} #Municipal.new
  			children = []
  			votes_temp = {}
  			s = obj.split(";")
  			temp1 = s[0]
  			temp2 = s[1].gsub(/#{Regexp.escape(s[0])}/, '').gsub(/:/, ' ').strip().split()
  			#for counting votes
  			votes_temp["name"] = temp1
  			votes_temp["id"] = temp1
  			votes_temp["children"] = temp2
  			@votes_model.push votes_temp
  			
  			if @model[temp1] == nil	
  				temp["name"] = temp1
  				temp["id"] = temp1
  				temp["children"] = temp2
  				
  				@all_municipals.push temp["name"]			
  				@model[temp1] = temp
  			elsif @model[temp1] != nil
  				temp2.each do |child|
  					@model[temp1]["children"].push child
  				end
  				@model[temp1]["children"] = @model[temp1]["children"].uniq
  			end
  		end
  		@votes = count_votes
  	end
  	
  end
   	
 
  def find(name)
    @model[name]
  end
  
  def get_all_municipals
    @all_municipals.sort
  end
  
  def get_all
  	result = []
  	@model.values.each do |el|
  		result.push el
  	end
  	result
  end
  
  def count_votes
    result = {}
    @votes_model.each do |elem|
    	name = elem["name"]
        elem["children"].each do |child_name|
        	if result[name + "-" + child_name] == nil
        		result[name + "-" + child_name] = 1      	
        	else 
        		result[name + "-" + child_name] = result[name + "-" + child_name] + 1
        	end  
        end
    end
    result
  end
    
  def set_depth_limit(limit)
    if limit >= 0 and limit < 10 
      @@depth_limit = limit
    end
  end
  
  def plot(name)
  	
  	graph = {}
  	@counter = @counter + 1 
  	rootnode = find(name)
  	@blacklist[name] = 1
  	graph["name"] = name
  	graph["id"] = name
  	if(graph["data"] == nil)
  		graph["data"] = {}
  	end
  	if(name == "Koski_Tl")
  		name = "Koski.Tl"
  	end
  	if @kunnat[name] != nil	  		
	  	graph["data"]["asukasluku"] = @kunnat[name]["asukasluku"]
	  	graph["data"]["pinta_ala"] = @kunnat[name]["pinta_ala"]
	  	graph["data"]["taajama_aste"] = @kunnat[name]["taajama_aste"]
  	end
  	
  	if(name == "Koski.Tl")
  		name = "Koski_Tl"
 	end
  	
  	root_children = plot_level(rootnode, 1)
  	
  	root_children.each do |child|
  		graph["data"][name + "-" + child["name"]] = 0;
  		graph["data"][name + "-" + child["name"]] = @votes[name + "-" + child["name"]]
  	end
  	
  	graph["children"] = root_children
  	@blacklist = {}
  	graph
  end

  def plot_level(node, counter)
  	
  	name = node["name"]
  	id = node["id"]
  	
  	if counter < @@depth_limit 
  		children = node["children"]
  		child_list = []
  		children.each do |child|
  		  if @blacklist[child] == nil
  		  	@blacklist[child] = 1
  		  	temp_child = find(child)
  		  	if temp_child != nil
  		  		temp_child["children"] = plot_level(temp_child, counter + 1)
  		  		temp_child["data"] = {}
  		  		#special case
  		  		if(child == "Koski_Tl")
  		  			child = "Koski.Tl"
  		  		end
  		  		puts child
	  		  	if @kunnat[child] != nil	  		
		  		  	temp_child["data"]["asukasluku"] = @kunnat[child]["asukasluku"]
		  		  	temp_child["data"]["taajama_aste"] = @kunnat[child]["taajama_aste"]
		  			temp_child["data"]["pinta_ala"] = @kunnat[child]["pinta_ala"]
 		 		end
 		 		if(child =="Koski.Tl")
 		 			child = "Koski_Tl"
 		 		end
 		 		temp_child["data"][name + "-" + child]  = 0
	  	  		temp_child["data"][name + "-" + child]  = @votes[name + "-" + child]
	  	  		temp_child["data"][child + "-" + name]  = 0
	 	  		temp_child["data"][child + "-" + name]  = @votes[child + "-" + name]
  		  		
  		  		child_list.push temp_child
  		  	else
  		  		temp_child = {}
  		  		temp_child["name"] = child
  		  		temp_child["id"] = child
  		  		temp_child["children"] = []
  		  		temp_child["data"] = {}
  		  		#special case
  		  		if(child == "Koski Tl")
  		  			child = "Koski.Tl"
  		  		end
  		  		puts child
  		  		if @kunnat[child] != nil	  		
	  		  		temp_child["data"]["asukasluku"] = @kunnat[child]["asukasluku"]
	  		  		temp_child["data"]["taajama_aste"] = @kunnat[child]["taajama_aste"]
	  		  		temp_child["data"]["pinta_ala"] = @kunnat[child]["pinta_ala"]
  		  		end
  		  		
  		  		if(child =="Koski.Tl")
 		 			child = "Koski Tl"
 		 		end
  		  		temp_child["data"][name + "-" + child]  = 0
  		  		temp_child["data"][name + "-" + child]  = @votes[name + "-" + child]
  		  		temp_child["data"][child + "-" + name]  = 0
  		  		temp_child["data"][child + "-" + name]  = @votes[child + "-" + name]
				
  		  	end
  		  	
  		  end
  		end
  		children = child_list
  	else
  		children = []
  	end
  	children
  end
  
  def to_s
    "In A:\n   #{@model}\n"
  end
 
  def to_json(*a)
  	{
  		"data" => @model
  	}.to_json(*a)
  end
 
  def self.json_create(o)
    new(o["name"], o["id"], o["children"])
  end
  
  def get
  	@model.to_json
  end
end

data = CSVData.new

p = CsvToJson.new(data.get_all, data.get_kunta_data)
#g = data.get_pre_formed
#puts g
#puts a.to_json
#puts a.to_json
#puts p.get
#puts p.get
#puts "find: "
#puts p.find("Särkisalo").to_json
#puts "_________________________________"

#puts "plot:"
c = p.plot("Vantaa")
puts c.to_json(:max_nesting => 10000)
puts p.get_all_municipals
#if nesting error: try c.to_json(:max_nesting => 100)
#puts "all_edges:"
#puts p.get_all_edges.to_json


#puts p.get_all.to_json
#puts p.count_votes.to_json
