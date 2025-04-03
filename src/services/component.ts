/**
 * Component Service for Vuetify MCP
 * Handles component data and code generation
 */

export interface ComponentProps {
  [key: string]: string | string[];
}

export interface ComponentMap {
  [key: string]: ComponentProps;
}

export class ComponentService {
  private componentProps: ComponentMap;

  constructor() {
    // Initialize component properties database
    this.componentProps = {
      "v-btn": {
        "color": "string - applies specified color to component",
        "variant": ["elevated", "flat", "tonal", "outlined", "text", "plain"],
        "size": ["x-small", "small", "default", "large", "x-large"],
        "rounded": "boolean - rounded button style",
        "block": "boolean - expands button to 100% width",
        "disabled": "boolean - disables the button",
        "icon": "string - adds icon to button or makes icon button when used alone",
        "prepend-icon": "string - adds icon before button content",
        "append-icon": "string - adds icon after button content",
      },
      "v-card": {
        "title": "string - card title",
        "subtitle": "string - card subtitle",
        "text": "string - card text content",
        "elevation": "number - elevation level (0-24)",
        "variant": ["elevated", "flat", "tonal", "outlined", "text", "plain"],
        "color": "string - applies specified color to component",
        "border": "boolean - adds border to card",
        "rounded": "string - sets border-radius",
        "hover": "boolean - adds hover effect",
        "loading": "boolean - adds loading state",
      },
      "v-text-field": {
        "label": "string - input label",
        "model-value": "any - controlled value",
        "placeholder": "string - input placeholder",
        "hint": "string - hint text",
        "counter": "boolean or number - adds counter",
        "density": ["default", "comfortable", "compact"],
        "variant": ["underlined", "filled", "outlined", "plain", "solo"],
        "disabled": "boolean - disables the input",
        "readonly": "boolean - makes input readonly",
        "clearable": "boolean - adds clear button",
        "persistent-hint": "boolean - keeps hint visible",
        "type": "string - input type (text, password, etc.)",
      },
      "v-select": {
        "items": "array - items to select from",
        "label": "string - select label",
        "model-value": "any - controlled value",
        "multiple": "boolean - allows multiple selection",
        "chips": "boolean - uses chips for selected items",
        "variant": ["underlined", "filled", "outlined", "plain", "solo"],
        "density": ["default", "comfortable", "compact"],
        "disabled": "boolean - disables the select",
        "readonly": "boolean - makes select readonly",
        "clearable": "boolean - adds clear button",
        "persistent-hint": "boolean - keeps hint visible",
        "hint": "string - hint text",
      },
      // More components would be added in a complete implementation
    };
  }

  /**
   * Get available properties for a specific Vuetify component
   * @param componentName Name of the component
   * @returns Object containing property details
   */
  getComponentProps(componentName: string): ComponentProps {
    return this.componentProps[componentName] || {};
  }

  /**
   * Generate code for a Vuetify component with the specified properties
   * @param componentName Name of the component
   * @param props Object containing properties to apply
   * @param content Optional content to include inside the component
   * @returns Generated component HTML
   */
  generateComponentCode(componentName: string, props: Record<string, any>, content?: string): string {
    const propsString = Object.entries(props)
      .map(([key, value]) => {
        if (typeof value === 'boolean') {
          return value ? key : '';
        }
        return `${key}="${value}"`;
      })
      .filter(Boolean)
      .join(' ');

    if (content) {
      return `<${componentName} ${propsString}>${content}</${componentName}>`;
    } else {
      return `<${componentName} ${propsString} />`;
    }
  }

  /**
   * Generate a form with the specified fields
   * @param formFields Array of field configurations
   * @returns Generated form HTML
   */
  generateForm(formFields: Array<{
    type: string;
    label?: string;
    props?: Record<string, any>;
  }>): string {
    let formCode = "<v-form>\n";
    
    for (const field of formFields) {
      const fieldType = field.type || 'v-text-field';
      const label = field.label || '';
      const props = field.props || {};
      
      // Add label to props if not already there and label is provided
      if (!props.label && label) {
        props.label = label;
      }
      
      // Convert props to string
      const propsStr = Object.entries(props)
        .map(([key, value]) => {
          if (typeof value === 'boolean') {
            return value ? key : '';
          }
          return `${key}="${value}"`;
        })
        .filter(Boolean)
        .join(' ');
      
      // Add field to form
      formCode += `  <${fieldType} ${propsStr}></${fieldType}>\n`;
    }
    
    formCode += "</v-form>";
    
    return formCode;
  }
}
