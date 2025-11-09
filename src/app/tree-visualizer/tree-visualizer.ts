import { Component, signal } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

interface TreeNode {
  name: string;
  children: TreeNode[];
  x: number;
  y: number;
  level: number;
}

interface TreeData {
  [key: string]: string[];
}

@Component({
  selector: 'app-tree-visualizer',
  templateUrl: './tree-visualizer.html',
  standalone: false,
  styleUrl: './tree-visualizer.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('300ms ease-in', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class TreeVisualizerComponent {
  protected readonly jsonInput = signal<string>('');
  protected readonly errorMessage = signal<string>('');
  protected readonly treeData = signal<TreeNode[]>([]);
  protected readonly svgLines = signal<Array<{ x1: number; y1: number; x2: number; y2: number }>>([]);
  protected readonly treeStructure = signal<TreeNode[]>([]); // Store tree structure for text view
  
  // Tooltip state
  protected readonly tooltipVisible = signal<boolean>(false);
  protected readonly tooltipText = signal<string>('');
  protected readonly tooltipX = signal<number>(0);
  protected readonly tooltipY = signal<number>(0);

  // Tab state
  protected readonly activeTab = signal<'visualize' | 'text'>('visualize');

  private readonly NODE_RADIUS = 30;
  private readonly HORIZONTAL_SPACING = 180;
  private readonly VERTICAL_SPACING = 120;
  private readonly SVG_PADDING = 50;
  
  protected readonly svgWidth = signal<number>(800);
  protected readonly svgHeight = signal<number>(600);
  protected readonly svgOffsetX = signal<number>(0);
  protected readonly svgOffsetY = signal<number>(0);

  protected handleVisualize = (): void => {
    const input = this.jsonInput().trim();
    
    if (!input) {
      this.errorMessage.set('Please enter JSON data');
      this.clearTree();
      return;
    }

    try {
      const parsed = JSON.parse(input);
      
      if (!this.isValidTreeData(parsed)) {
        this.errorMessage.set('Invalid format: Must be an object with all values as arrays');
        this.clearTree();
        return;
      }

      this.errorMessage.set('');
      this.buildTree(parsed);
    } catch (error) {
      this.errorMessage.set('Invalid JSON format');
      this.clearTree();
    }
  };

  protected handleClear = (): void => {
    this.jsonInput.set('');
    this.errorMessage.set('');
    this.clearTree();
  };

  protected getSvgWidth = (): number => this.svgWidth();
  protected getSvgHeight = (): number => this.svgHeight();
  protected getSvgOffsetX = (): number => this.svgOffsetX();
  protected getSvgOffsetY = (): number => this.svgOffsetY();

  protected getViewBox = (): string => {
    return `0 0 ${this.svgWidth()} ${this.svgHeight()}`;
  };

  protected handleLabelMouseEnter = (event: MouseEvent, nodeName: string): void => {
    this.tooltipText.set(nodeName);
    this.tooltipX.set(event.clientX);
    this.tooltipY.set(event.clientY - 30);
    this.tooltipVisible.set(true);
  };

  protected handleLabelMouseLeave = (): void => {
    this.tooltipVisible.set(false);
  };

  protected handleLabelMouseMove = (event: MouseEvent): void => {
    if (this.tooltipVisible()) {
      this.tooltipX.set(event.clientX);
      this.tooltipY.set(event.clientY - 30);
    }
  };

  // Tab controls
  protected setActiveTab = (tab: 'visualize' | 'text'): void => {
    this.activeTab.set(tab);
  };

  // Generate text view HTML
  protected generateTextView = (): string => {
    const structure = this.treeStructure();
    if (structure.length === 0) {
      return '';
    }

    const generateList = (nodes: TreeNode[], indentLevel: number = 0): string => {
      if (nodes.length === 0) {
        return '';
      }

      let html = '<ul>';
      nodes.forEach(node => {
        html += `<li class="pl-6">- ${node.name}`;
        if (node.children.length > 0) {
          html += generateList(node.children, indentLevel + 1);
        }
        html += '</li>';
      });
      html += '</ul>';
      return html;
    };

    return generateList(structure);
  };

  private clearTree = (): void => {
    this.treeData.set([]);
    this.svgLines.set([]);
    this.treeStructure.set([]);
    this.svgWidth.set(800);
    this.svgHeight.set(600);
    this.svgOffsetX.set(0);
    this.svgOffsetY.set(0);
  };

  private isValidTreeData = (data: unknown): data is TreeData => {
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
      return false;
    }
    const obj = data as Record<string, unknown>;
    return Object.values(obj).every(value => Array.isArray(value));
  };

  private buildTree = (data: TreeData): void => {
    const nodes: TreeNode[] = [];
    const lines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
    const nodeMap = new Map<string, TreeNode>();
    
    // Find root nodes
    const allChildren = new Set<string>();
    Object.values(data).forEach(children => {
      children.forEach(child => allChildren.add(child));
    });

    const rootNodes = Object.keys(data).filter(key => !allChildren.has(key));
    if (rootNodes.length === 0 && Object.keys(data).length > 0) {
      rootNodes.push(Object.keys(data)[0]);
    }

    // Build tree structure
    const buildTreeStructure = (name: string, level: number): TreeNode => {
      if (nodeMap.has(name)) {
        return nodeMap.get(name)!;
      }

      const node: TreeNode = {
        name,
        children: [],
        x: 0,
        y: 0,
        level
      };

      nodeMap.set(name, node);
      nodes.push(node);

      const children = data[name] || [];
      children.forEach(childName => {
        const childNode = buildTreeStructure(childName, level + 1);
        node.children.push(childNode);
      });

      return node;
    };

    rootNodes.forEach(rootName => buildTreeStructure(rootName, 0));

    // Store tree structure for text view (before positioning)
    const treeStructureCopy: TreeNode[] = [];
    const copyTree = (node: TreeNode): TreeNode => {
      const copy: TreeNode = {
        name: node.name,
        children: [],
        x: 0,
        y: 0,
        level: node.level
      };
      node.children.forEach(child => {
        copy.children.push(copyTree(child));
      });
      return copy;
    };
    nodes.forEach(node => {
      if (node.level === 0) {
        treeStructureCopy.push(copyTree(node));
      }
    });
    this.treeStructure.set(treeStructureCopy);

    // Calculate positions
    const positionNodes = (node: TreeNode, startX: number, startY: number): number => {
      node.y = startY;
      
      if (node.children.length === 0) {
        node.x = startX;
        return startX + this.HORIZONTAL_SPACING;
      }

      let currentX = startX;
      const childPositions: number[] = [];

      node.children.forEach(child => {
        const nextX = positionNodes(child, currentX, startY + this.VERTICAL_SPACING);
        childPositions.push(child.x);
        currentX = nextX;
      });

      node.x = (Math.min(...childPositions) + Math.max(...childPositions)) / 2;
      return currentX;
    };

    let currentX = this.SVG_PADDING;
    rootNodes.forEach(rootName => {
      const rootNode = nodeMap.get(rootName);
      if (rootNode) {
        currentX = positionNodes(rootNode, currentX, this.SVG_PADDING);
        currentX += this.HORIZONTAL_SPACING;
      }
    });

    // Build connecting lines
    nodes.forEach(node => {
      node.children.forEach(child => {
        lines.push({
          x1: node.x,
          y1: node.y + this.NODE_RADIUS,
          x2: child.x,
          y2: child.y - this.NODE_RADIUS
        });
      });
    });

    // Calculate tree bounds
    const minX = Math.min(...nodes.map(n => n.x), 0) - this.NODE_RADIUS;
    const maxX = Math.max(...nodes.map(n => n.x), 0) + this.NODE_RADIUS;
    const minY = Math.min(...nodes.map(n => n.y), 0) - this.NODE_RADIUS;
    const maxY = Math.max(...nodes.map(n => n.y), 0) + this.NODE_RADIUS;

    const treeWidth = maxX - minX;
    const treeHeight = maxY - minY;

    // Calculate SVG dimensions with padding
    const svgWidth = Math.max(treeWidth + (this.SVG_PADDING * 2), 800);
    const svgHeight = Math.max(treeHeight + (this.SVG_PADDING * 2), 600);

    // Calculate center offsets to center the tree in the SVG
    const treeCenterX = (minX + maxX) / 2;
    const treeCenterY = (minY + maxY) / 2;
    const svgCenterX = svgWidth / 2;
    const svgCenterY = svgHeight / 2;

    const centerOffsetX = svgCenterX - treeCenterX;
    const centerOffsetY = svgCenterY - treeCenterY;

    // Center the tree by adjusting node positions
    nodes.forEach(node => {
      node.x += centerOffsetX;
      node.y += centerOffsetY;
    });

    // Update line positions
    lines.forEach(line => {
      line.x1 += centerOffsetX;
      line.y1 += centerOffsetY;
      line.x2 += centerOffsetX;
      line.y2 += centerOffsetY;
    });

    this.svgWidth.set(svgWidth);
    this.svgHeight.set(svgHeight);
    this.treeData.set(nodes);
    this.svgLines.set(lines);
  };
}
