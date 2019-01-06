//Draw Function
const draw = () => {
    //Declare margin, width and height
    const margin = 100,
        width = 800, 
        height = 500;

    //Declare svg
    const svg = d3.select('body')
        .append('svg')
        .attr('viewBox', `0 0 ${width+margin} ${height+margin}`)
        // .attr('width', width+margin)
        // .attr('height',height+margin) 

    //Create nodes function
    // const createNodes = (numNodes, radius) => {
    //     let nodes = [], 
    //     angle,
    //     x,
    //     y,
    //     i;
    // for (i=0; i<numNodes; i++) {
    //     angle = (i / (numNodes/2)) * Math.PI; // Calculate the angle at which the element will be placed.
    //                                         // For a semicircle, we would use (i / numNodes) * Math.PI.
    //     x = (radius * Math.cos(angle))+(width/2);// Calculate the x position of the element.
    //     y = (radius * Math.sin(angle))+(height/1.6); // Calculate the y position of the element.
    //     nodes.push({'id': i, 'x': x, 'y': y, 'value':i, 'angle':angle});
    // }
    // return nodes;
    // // console.log(nodes)
    // }

    //Create nodes using d3.pie
    const createNodes = (numNodes, radius) => {
        let nodes = [], 
        angle,
        x,
        y,
        i;

        const arc = d3.arc()
                .innerRadius(radius)
                .outerRadius(radius)
                // .startAngle(nodes[8].angle+1.5)
                // .endAngle(nodes[27].angle+1.5);
                .padAngle(0.05)
                .padRadius(25)
                .cornerRadius(40);
        const pie =d3.pie()
                    .value (d => d.value);
        for (i=0; i<numNodes; i++) {
            nodes.push({'id': i, 'value':1, 'angle':angle});
        }
        //return nodes;
        // console.log(nodes)

        const path = d3.select('svg')
                    .append('g')
                    .selectAll('path')
                    .data(pie(nodes))
                    .enter()
                    .append('path')
                    .attr('d', arc)
                    //.attr('fill','green')
                    //.attr('stroke', 'white')
                    .attr('transform', `translate(${width/2},${height/1.6})`);

    }

    const innerNodes = createNodes(26, 90);
    const midNodes = createNodes(31, 180);
    const outerNodes = createNodes(111, 270);

    let allNodes = innerNodes.concat(midNodes);

    allNodes = allNodes.concat(outerNodes);

    // console.log(innerNodes[0]);

    // //create circles
    // const circles = d3.select('svg')
    //                     .append('g')
    //                     .selectAll('circle')
    //                     .data(allNodes)
    //                     .enter()
    //                     .append('circle')
    //                     .attr('r', 8)
    //                     .attr('cx', d => d.x)
    //                     .attr('cy', d => d.y);

    const nodes = allNodes.slice(),
        nodeById = d3.map([nodes[0],nodes[8],nodes[27],nodes[59]], d => d.id),
        links = [{"source": nodes[0].id, "target": nodes[8].id, "value": 1},
                // {"source": nodes[8].id, "target": nodes[27].id, "value": 1},
                 {"source": nodes[27].id, "target": nodes[59].id, "value": 1}],
        bilinks = [];
      links.forEach(function(link) {
        let s = link.source = nodeById.get(link.source),
            t = link.target = nodeById.get(link.target),
            i = {x: link.target.x, y: link.source.y}; // intermediate node
        nodes.push(i);
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

    // //pie
    // pie = d3.pie()
    //         // .sort(null)
    //         // .value(d => d.value)

    const radius = 110;
    const arc = d3.arc()
                .innerRadius(radius)
                .outerRadius(radius)
                .startAngle(nodes[8].angle+1.5)
                .endAngle(nodes[27].angle+1.5);
                //.padAngle(0.05)
                //.padRadius(25)
                //.cornerRadius(40);

    const path = d3.select('svg')
                .append('g')
                .selectAll('path')
                .data(d3.pie()(1))
                .enter()
                .append('path')
                .attr('d', arc)
                //.attr('fill','green')
                //.attr('stroke', 'white')
                .attr('transform', `translate(${width/2},${height/1.6})`);

    const points = [
            //nodes[8],nodes[27]
        ];
        let radialObj = {}
        let r = 90;
        let a = nodes[8].angle;
        radialObj.a=a;
        radialObj.r=r;
        points.push(radialObj);
        r=radius;
        for(i=nodes[27].angle;i< nodes[8].angle; i++) {
            if(i==nodes[27].angle) {
                r = 180;
            } 
            let Obj ={}
            Obj.a=i;
            Obj.r=r;
            points.push(Obj);
        }
    console.log(points)
    console.log(Math.sin(nodes[27].angle));



    // var points = [
    //     [0, 80],
    //     [Math.PI * 0.25, 80],
    //     [Math.PI * 0.5, 30],
    //     [Math.PI * 0.75, 80],
    //     [Math.PI, 80],
    //     [Math.PI * 1.25, 80],
    //     [Math.PI * 1.5, 80],
    //     [Math.PI * 1.75, 80],
    //     [Math.PI * 2, 80]
    // ];

    const line = d3.lineRadial()//(points)
                    .radius(d => d.r)
                    .angle(d => d.a)// * Math.PI/180)
                    .curve(d3.curveCardinal)

    d3.select('svg')
    //.append('g')
   // .selectAll('path')
    .append('path')
    .attr('d',line(points))
    .attr('transform', `translate(${width/2},${height/1.6})`);
}

draw();