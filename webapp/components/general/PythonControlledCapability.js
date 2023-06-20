/* eslint-disable no-param-reassign */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable max-classes-per-file */
/* eslint-disable max-len */
/**
 *
 * Synched capability
 * @module Widgets/Widget
 * @author Adrian Quintana (adrian@metacell.us)
 * @author Matteo Cantarelli (matteo@metacell.us)
 */
define((require) => {
  const $ = require('jquery');
  const React = require('react');
  const GeppettoUtils = require('./GeppettoJupyterUtils');

  module.exports = {
    createPythonControlledComponent (WrappedComponent) {
      if (typeof WrappedComponent !== 'function') {
        // Fixes components defined as objects (e.g. Material-ui components)
        class Wrapper extends React.Component {
          render () {
            return <WrappedComponent {...this.props} />;
          }
        }

        WrappedComponent = Wrapper;
      }

      class PythonControlledComponent extends WrappedComponent {
        constructor (props) {
          super(props);
          if (this.state === undefined) {
            this.state = {};
          }
          this.state.model = props.model;
          this.state.componentType = getNameFromWrappedComponent(WrappedComponent);
          this.id = (this.props.id === undefined) ? this.props.model : this.props.id;

          this._isMounted = false;
        }

        setSyncValueWithPythonHandler (handler) {
          this.syncValueWithPython = handler;
        }

        connectToPython (componentType, model) {
          GeppettoUtils.execPythonMessage(`jupyter_geppetto.ComponentSync(componentType="${componentType}",model="${model}",id="${this.id}").connect()`);
        }

        disconnectFromPython () {
          GeppettoUtils.execPythonMessage(`jupyter_geppetto.remove_component_sync(componentType="${this.state.componentType}",model="${this.id}")`);
          GEPPETTO.ComponentFactory.removeExistingComponent(this.state.componentType, this);
        }

        componentWillUnmount () {
          this._isMounted = false;
          this.disconnectFromPython();
        }

        componentDidMount () {
          this._isMounted = true;
          GEPPETTO.ComponentFactory.addExistingComponent(this.state.componentType, this, true);
          if (this.props.model !== undefined) {
            this.connectToPython(this.state.componentType, this.props.model);
          }
          if (this.props.value !== undefined) {
            this.setState({ value: this.props.value });
          }
        }
      }

      return PythonControlledComponent;
    },

    createPythonControlledControl (WrappedComponent) {
      const PythonControlledComponent = this.createPythonControlledComponent(WrappedComponent);

      class PythonControlledControl extends PythonControlledComponent {
        constructor (props) {
          super(props);
          this.state = $.extend(this.state, {
            value: '',
            searchText: '',
            checked: false,
          });

          // If a handleChange method is passed as a props it will overwrite the handleChange python controlled capability
          this.handleChange = (this.props.handleChange === undefined) ? this.handleChange.bind(this) : this.props.handleChange.bind(this);
          this.handleUpdateInput = this.handleUpdateInput.bind(this);
          this.handleUpdateCheckbox = this.handleUpdateCheckbox.bind(this);
          this.commands = undefined ;
        }

        componentDidMount () {
          super.componentDidMount();
          //this.UNRELIABLE_SyncDefaultValueWithPython();
        }

        refreshPython() {
          this.disconnectFromPython();
          GEPPETTO.ComponentFactory.addExistingComponent(this.state.componentType, this);
          this.connectToPython(this.state.componentType, this.props.model);
        }

        componentDidUpdate (prevProps, prevState) {
          switch (getNameFromWrappedComponent(WrappedComponent)) {
            case 'AutoComplete':
              if (this.state.searchText !== prevState.searchText && this.props.onChange) {
                this.props.onChange(this.state.searchText);
              }
              break;
            case 'Checkbox':
              if (this.state.checked !== prevState.checked && this.props.onChange) {
                this.props.onChange(null, this.state.checked);
              }
              break;
            default:
              if (this.state.value !== prevState.value && this.props.onChange) {
                this.props.onChange(null, null, this.state.value);
              }
              break;
          }
          if (this.props.validate) {
            this.props.validate(this.state.value)
              .then((response) => {
                if (this.state.errorState !== response.errorMsg) {
                  this.setState({ errorState: response.errorMsg });
                }
              });
          }

          if (
            /*
             * If the component changes id without unmounting,
             * then default values will never be synched with python
             */
            this.props.model === prevProps.model
            && this.state.value === ''
            && this.props.default
          ) {
            //this.UNRELIABLE_SyncDefaultValueWithPython(1000);
          }
        }

        updatePythonValue (newValue) {
          if (this.props.prePythonSyncProcessing !== undefined) {
            newValue = this.props.prePythonSyncProcessing(newValue);
          }
          // whenever we invoke syncValueWithPython we will propagate
          // the Javascript value of the model to Python
          if (this.syncValueWithPython) {
            switch (this.props.realType) {
              case 'float':
                if (!isNaN(newValue) && newValue !== '') {
                  newValue = parseFloat(newValue);
                }
                break;
              case 'dict':
                if (typeof newValue === 'string') {
                  newValue = JSON.parse(newValue);
                }
                break;
              case 'func':
                // 'func' type can be a function or a float in netpyne
                // In case the value is a float we want to convert "1.4" -> 1.4
                if (!isNaN(newValue) && newValue !== '') {
                  newValue = parseFloat(newValue);
                }
                break;
              default:
                break;
            }
            // Don't sync if new value is emtpy string
            if (newValue !== '') {
              this.syncValueWithPython(newValue);
            }

            if (this.props.callback) {
              this.props.callback(newValue, this.oldValue);
            }
            this.oldValue = undefined;
          }
          this.setState({
            value: newValue,
            searchText: newValue,
            checked: newValue,
          });
          this.forceUpdate();
        }

        triggerUpdate (updateMethod) {
          // common strategy when triggering processing of a value change, delay it, every time there is a change we reset
          if (this.updateTimer !== undefined) {
            clearTimeout(this.updateTimer);
          }
          this.updateTimer = setTimeout(updateMethod, 1000);
        }

        // Default handle (mainly textfields and dropdowns)
        handleChange (event, index, value) {
          let targetValue = value;
          if (event != null && event.target.value !== undefined) {
            targetValue = event.target.value;
          }
          if (this.oldValue === undefined) {
            this.oldValue = this.state.value;
          }

          this.setState({ value: targetValue });

          if (this.props.validate) {
            this.props.validate(targetValue)
              .then((response) => {
                if (response.errorMsg !== this.state.errorMsg) {
                  this.setState({ errorMsg: response.errorMsg });
                }
              });
          }

          // For textfields value is retrieved from the event. For dropdown value is retrieved from the value
          this.triggerUpdate(() => this.updatePythonValue(targetValue));
        }

        // Autocomplete handle
        handleUpdateInput (value) {
          this.triggerUpdate(() => this.updatePythonValue(value));
        }

        // Checkbox
        handleUpdateCheckbox (event, isInputChecked) {
          this.updatePythonValue(isInputChecked);
          this.refreshPython();
        }

        render () {
          const wrappedComponentProps = { ...this.props };
          if (wrappedComponentProps.key === undefined) {
            wrappedComponentProps.key = wrappedComponentProps.model;
          }
          if (wrappedComponentProps.id === undefined) {
            wrappedComponentProps.id = wrappedComponentProps.model ?? '';
          }

          wrappedComponentProps.id = cleanAttributeValue(wrappedComponentProps.id);

          delete wrappedComponentProps.model;
          delete wrappedComponentProps.handleChange;

          delete wrappedComponentProps.modelName;
          delete wrappedComponentProps.dimensionType;
          delete wrappedComponentProps.noStyle;
          delete wrappedComponentProps.validate;
          delete wrappedComponentProps.prePythonSyncProcessing;
          delete wrappedComponentProps.callback;

          if (wrappedComponentProps.realType === 'func' || wrappedComponentProps.realType === 'float') {
            wrappedComponentProps.helperText = this.state.errorMsg;
          }
          if (!getNameFromWrappedComponent(WrappedComponent)
            .includes('ListComponent')) {
            delete wrappedComponentProps.realType;
          }

          switch (getNameFromWrappedComponent(WrappedComponent)) {
            case 'AutoComplete':
              wrappedComponentProps.onUpdateInput = this.handleUpdateInput;
              wrappedComponentProps.searchText = this.state.searchText;
              break;
            case 'Checkbox':
              wrappedComponentProps.onChange = this.handleUpdateCheckbox;
              wrappedComponentProps.checked = this.state.checked;
              delete wrappedComponentProps.searchText;
              delete wrappedComponentProps.dataSource;
              delete wrappedComponentProps.floatingLabelText;
              delete wrappedComponentProps.hintText;
              break;
            default:
              wrappedComponentProps.onChange = this.handleChange;
              wrappedComponentProps.value = (typeof this.state.value === 'object'
                && this.state.value !== null
                && !Array.isArray(this.state.value))
                ? JSON.stringify(this.state.value)
                : this.state.value;
              // Fix case with multiple values: need to set an empty list in case the value is undefined
              wrappedComponentProps.value = (wrappedComponentProps.multiple
                && wrappedComponentProps.value !== undefined
                && !wrappedComponentProps.value) ? [] : wrappedComponentProps.value;
              delete wrappedComponentProps.searchText;
              delete wrappedComponentProps.dataSource;
              break;
          }

          return (
            <WrappedComponent {...wrappedComponentProps} />
          );
        }
      }

      return PythonControlledControl;
    },

    createPythonControlledControlWithPythonDataFetch (WrappedComponent) {
      const PythonControlledComponent = this.createPythonControlledComponent(WrappedComponent);

      class PythonControlledControlWithPythonDataFetch extends PythonControlledComponent {
        constructor (props) {
          super(props);
          this.state = {
            ...this.state,
            value: [],
            pythonData: [],
          };
          // If a handleChange method is passed as a props it will overwrite the handleChange python controlled capability
          this.handleChange = (this.props.handleChange === undefined) ? this.handleChange.bind(this) : this.props.handleChange.bind(this);
          this.callPythonMethod();
        }

        UNSAFE_componentWillReceiveProps (nextProps) {
          this.disconnectFromPython();
          this.id = (nextProps.id === undefined) ? nextProps.model : nextProps.id;

          GEPPETTO.ComponentFactory.addExistingComponent(this.state.componentType, this);
          this.connectToPython(this.state.componentType, nextProps.model);
          this.callPythonMethod();
        }

        updatePythonValue (newValue) {
          this.setState({
            value: newValue,
            searchText: newValue,
            checked: newValue,
          });
          if (this.syncValueWithPython) {
            this.syncValueWithPython(newValue);
          }

          this.forceUpdate();
        }

        // Default handle (mainly textfields and dropdowns)
        handleChange (event, index, value) {
          let targetValue = value;
          if (event != null && event.target.value !== undefined) {
            targetValue = event.target.value;
          }
          this.setState({ value: targetValue });
          this.updatePythonValue(targetValue);
        }

        compareArrays (array1, array2) {
          // if the other array is a falsy value, return
          if (!array1 || !array2) {
            return false;
          }

          // compare lengths - can save a lot of time
          if (array1.length !== array2.length) {
            return false;
          }

          for (let i = 0, l = array1.length; i < l; i++) {
            // Check if we have nested arrays
            if (array1[i] instanceof Array && array2[i] instanceof Array) {
              // recurse into the nested arrays
              if (!array1[i].equals(array2[i])) {
                return false;
              }
            } else if (array1[i] !== array2[i]) {
              // Warning - two different object instances will never be equal: {x:20} != {x:20}
              return false;
            }
          }
          return true;
        }

        callPythonMethod = (value) => {
          const params = this.props?.pythonparams || [];
          if (this.props.method) {
            GeppettoUtils.evalPythonMessage(this.props.method, params)
              .then((response) => {
                if (this._isMounted) {
                  if (Object.keys(response).length !== 0) {
                    this.setState({ pythonData: response });
                  } else {
                    this.setState({ pythonData: [] });
                  }
                }
              });
          }
        };

        componentDidUpdate (prevProps, prevState) {
          if (!this.compareArrays(this.state.value, prevState.value)) {
            if ($.isArray(this.state.value)) {
              for (const v in this.state.value) {
                if (this.state.pythonData.indexOf(this.state.value[v]) < 0) {
                  const newValue = [this.state.value[v]];
                  this.setState({ pythonData: this.state.pythonData.concat(newValue) });
                }
              }
            }
          }
        }

        shouldComponentUpdate (nextProps, nextState) {
          return !this.compareArrays(this.state.pythonData, nextState.pythonData) || !this.compareArrays(this.state.value, nextState.value);
        }

        render () {
          const wrappedComponentProps = { ...this.props };
          if (wrappedComponentProps.key === undefined) {
            wrappedComponentProps.key = wrappedComponentProps.model;
          }
          if (wrappedComponentProps.id === undefined) {
            wrappedComponentProps.id = wrappedComponentProps.model ?? '';
          }

          wrappedComponentProps.id = cleanAttributeValue(wrappedComponentProps.id);

          wrappedComponentProps.onChange = this.handleChange;
          wrappedComponentProps.value = wrappedComponentProps.multiple
          && this.state.value !== undefined
          && !this.state.value ? [] : this.state.value;
          delete wrappedComponentProps.model;
          delete wrappedComponentProps.postProcessItems;
          delete wrappedComponentProps.validate;
          delete wrappedComponentProps.prePythonSyncProcessing;
          delete wrappedComponentProps.updates;

          if (this.props.postProcessItems) {
            var items = this.props.postProcessItems(this.state.pythonData, wrappedComponentProps.value);
          }

          return (
            <WrappedComponent {...wrappedComponentProps}>
              {items}
            </WrappedComponent>
          );
        }
      }

      return PythonControlledControlWithPythonDataFetch;
    },
  };
});

function getNameFromWrappedComponent (WrappedComponent) {
  return WrappedComponent.name || WrappedComponent.displayName || WrappedComponent?.Naked?.render?.name || WrappedComponent?.render?.name;
}

/**
 * Removes invalid characters from value to enable querying of selectors.
 *
 * Due to close integration with Python commands, characters []'". can be part of an id attribute.
 */
function cleanAttributeValue (value) {
  return value.replace(/[[\]'.]+/g, '');
}