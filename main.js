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
            nodes.push({'id': i, 'value':1});
        }
        return nodes;
    }

    const innerNodes = createNodes(26, 90);
    const midNodes = createNodes(31, 180);
    const outerNodes = createNodes(111, 270);

    let allNodes = innerNodes.concat(midNodes);

    allNodes = allNodes.concat(outerNodes);

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
        console.log(centroid)
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

    /*
    const paths = d3.select('svg')
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
            //centroid[8],centroid[27]
        ];
        let radialObj = {}
        let r = 90;
        let a = centroid[8].angle;
        radialObj.a=a;
        radialObj.r=r;
        points.push(radialObj);
        r=radius;
        for(i=centroid[27].angle;i< centroid[8].angle; i++) {
            if(i==centroid[27].angle) {
                r = 180;
            } 
            let Obj ={}
            Obj.a=i;
            Obj.r=r;
            points.push(Obj);
        }



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
    */
}

draw();