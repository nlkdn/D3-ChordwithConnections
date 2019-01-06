//Draw Function
const draw = () => {
    //Declare margin, width and height
    const margin = 100,
        width = 800, 
        height = 500;

    //Declare svg
    const svg = d3.select('body')
        .append('svg')
        .attr('viewBox', `0 0 ${width+margin} ${height+margin}`);

    //Create nodes using d3.pie
    const createNodes = (numNodes, radius) => {
        let nodes = [];
        for (i=0; i<numNodes; i++) {
            nodes.push({'id': i, 'r':radius, 'value':1});
        }
        return nodes;
    }

    const innerNodes = createNodes(26, 90);
    const midNodes = createNodes(31, 180);
    const outerNodes = createNodes(111, 270);

    const createCircle = (nodes,radius) => {
        const arcs = d3.arc()
                    .innerRadius(radius)
                    .outerRadius(radius+20)
                    .padAngle(0.2)
                    .padRadius(25)
                    .cornerRadius(40);
        const pie = d3.pie()
                    .value(d => d.value);

        const path = d3.select('svg')
                    .append('g')
                    .attr('transform', `translate(${width/2},${height/1.6})`)
                    .selectAll('path')
                    .data(pie(nodes))
                    .enter()
                    .append('path')
                    .attr('d', arcs)
                    .attr('class','arcs');
                    //.attr('fill','green')
                    //.attr('stroke', 'white')

        const dot =  d3.symbol();
        const dots = d3.select('svg')
                    .append('g')
                    .attr('transform', `translate(${width/2},${height/1.6})`)
                    .selectAll('path')
                    .data(pie(nodes))
                    .enter()
                    .append('path')
                    .attr("transform", d => `translate(${arcs.centroid(d)})`)
                    .attr('d',dot)
                    .attr('color','green')
                    .attr('fill','green')
                    .attr('class','dots');

        const centroid = pie(nodes).map(function(d, i) {
            d.innerRadius = radius;
            d.outerRadius = radius+20;
            d.data.x = arcs.centroid(d)[0]+width/2;
            d.data.y = arcs.centroid(d)[1]+height/1.6;
            d.data.endAngle = d.endAngle; 
            d.data.startAngle = d.startAngle; 
            return d.data;
          })

        return centroid;
    }

    const innerCircle = createCircle(innerNodes, 90);
    const midCircle = createCircle(midNodes, 180);
    const outerCircle = createCircle(outerNodes, 260);

    const innerConnection = (source, target) => {
        const links = [{"source": source, "target": target, "value": 1}]
            // {"source": centroid[8].id, "target": centroid[27].id, "value": 1},
                //{"source": centroid[27], "target": centroid[59], "value": 1}],
            bilinks = [];
        links.forEach(function(link) {
            let s = link.source //= nodeById.get(link.source),
                t = link.target //= nodeById.get(link.target),
                i = {x: link.target.y, y: link.source.x}; // intermediate node
            links.push({source: s, target: i}, {source: i, target: t});
            bilinks.push([s, i, t]);
        });
        // create links by force simulation
        const simulation = d3.forceSimulation()
                    .force("link", d3.forceLink(links))
                    .force("charge", d3.forceManyBody())
                    .force("center", d3.forceCenter(width / 2, height / 1.6))
                    .on("tick", ticked);

        const group = svg.append('g');

        //tick function
        function ticked() {
            const link = group
                .selectAll('path')
                .data(bilinks)
                .enter().append("path")
                //.attr("class", "link")
                .attr("d", positionLink);
        }

        //curved path
        const positionLink = d  => `M${d[0].x},${d[0].y} Q${d[1].x},${d[1].y} ${d[2].x},${d[2].y}`;

    }        
        
    innerConnection(innerCircle[0], innerCircle[8]);
    console.log((innerCircle[0].startAngle+innerCircle[0].endAngle)/2)
    console.log((midCircle[25].startAngle+midCircle[25].endAngle)/2)


    const radialConnection = (source, target, increasedRadius, direction='clockwise') => {
        const points =[],
            startAngle = (source.startAngle+source.endAngle)/2,
            startRadius = source.r+10,
            endAngle = (target.startAngle+target.endAngle)/2,
            endRadius = target.r+10;

        points.push([startAngle, startRadius]);

        if (direction === 'anti-clockwise') {
            for(i=startAngle; i > endAngle-(2*Math.PI); i= i-(10*Math.PI/180) ) {
                points.push([i, startRadius+increasedRadius]);
            }
            points.push([endAngle,endRadius])
        } 
        else if(direction === 'clockwise') {
            for(i=startAngle; i < endAngle; i= i+(10*Math.PI/180) ) {
                points.push([i, startRadius+increasedRadius]);
            }
            points.push([endAngle,endRadius])
        }
        console.log(points);
        // const points = [
        //     [(innerCircle[0].startAngle+innerCircle[0].endAngle)/2, innerCircle[0].r+10],
        //     [(innerCircle[0].startAngle+innerCircle[0].endAngle)/2, innerCircle[0].r+40],
        //     [innerCircle[0].startAngle-(10*Math.PI/180), innerCircle[0].r+40],
        //     [innerCircle[0].startAngle-(20*Math.PI/180), innerCircle[0].r+40],
        //     [innerCircle[0].startAngle-(30*Math.PI/180), innerCircle[0].r+40],
        //     [innerCircle[0].startAngle-(40*Math.PI/180), innerCircle[0].r+40],
        //     [innerCircle[0].startAngle-(50*Math.PI/180), innerCircle[0].r+40],
        //     [innerCircle[0].startAngle-(60*Math.PI/180), innerCircle[0].r+40],
        //     [(midCircle[25].startAngle+midCircle[25].endAngle)/2, innerCircle[0].r+40],
        //     [(midCircle[25].startAngle+midCircle[25].endAngle)/2, midCircle[25].r+10]
        // ];
    
        const line = d3.lineRadial()
                        //.radius(d => d.r)
                        //.angle(d => d.a)// * Math.PI/180)
                        .curve(d3.curveBasis)
    
        d3.select('svg')
            .append('g')
            .append('path')
            .attr('d',line(points))
            .attr('transform', `translate(${width/2},${height/1.6})`);
    }
    
    radialConnection(innerCircle[0], midCircle[25], 40, 'anti-clockwise')
    radialConnection(midCircle[25], outerCircle[95], 40)
}

draw();