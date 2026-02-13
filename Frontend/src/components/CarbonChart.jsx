import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const CarbonChart = ({ data }) => {
    const d3Container = useRef(null);

    useEffect(() => {
        if (data && d3Container.current) {
            // Clear previous chart
            d3.select(d3Container.current).selectAll('*').remove();

            // Set dimensions
            const margin = { top: 20, right: 30, bottom: 40, left: 50 };
            const width = 450 - margin.left - margin.right;
            const height = 250 - margin.top - margin.bottom;

            // Append SVG
            const svg = d3.select(d3Container.current)
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            // X Scale
            const x = d3.scaleBand()
                .range([0, width])
                .domain(data.map(d => d.date))
                .padding(0.2);

            svg.append('g')
                .attr('transform', `translate(0,${height})`)
                .call(d3.axisBottom(x))
                .selectAll('text')
                .attr('transform', 'translate(-10,0)rotate(-45)')
                .style('text-anchor', 'end');

            // Y Scale
            const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.value) * 1.2])
                .range([height, 0]);

            svg.append('g')
                .call(d3.axisLeft(y));

            // Tooltip
            const tooltip = d3.select(d3Container.current)
                .append('div')
                .style('position', 'absolute')
                .style('background', 'rgba(15, 23, 42, 0.9)')
                .style('color', '#fff')
                .style('padding', '8px')
                .style('border-radius', '8px')
                .style('font-size', '12px')
                .style('display', 'none')
                .style('pointer-events', 'none');

            // Bars
            svg.selectAll('rect')
                .data(data)
                .enter()
                .append('rect')
                .attr('x', d => x(d.date))
                .attr('y', d => y(d.value))
                .attr('width', x.bandwidth())
                .attr('height', d => height - y(d.value))
                .attr('fill', '#10b981')
                .attr('rx', 4)
                .on('mouseover', (event, d) => {
                    tooltip
                        .style('display', 'block')
                        .html(`<strong>${d.date}</strong>: ${d.value}g CO2`);
                    d3.select(event.currentTarget).attr('fill', '#059669');
                })
                .on('mousemove', (event) => {
                    tooltip
                        .style('top', (event.pageY - 10) + 'px')
                        .style('left', (event.pageX + 10) + 'px');
                })
                .on('mouseout', (event) => {
                    tooltip.style('display', 'none');
                    d3.select(event.currentTarget).attr('fill', '#10b981');
                });

            // Add titles
            svg.append('text')
                .attr('x', width / 2)
                .attr('y', 0 - (margin.top / 2))
                .attr('text-anchor', 'middle')
                .style('font-size', '14px')
                .style('font-weight', '600')
                .text('Émissions de CO2 par session (g)');
        }
    }, [data]);

    return <div className="d3-chart-container" ref={d3Container} style={{ position: 'relative' }} />;
};

export default CarbonChart;
