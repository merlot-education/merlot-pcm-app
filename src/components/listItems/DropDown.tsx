import React, { useCallback, useEffect, useState } from 'react';
import DropDownPicker, {
  ItemType,
  ValueType,
} from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/AntDesign';
import { TextTheme } from '../../theme/theme';

interface Item {
  value: string;
  label: string;
}

interface Props {
  items: Item[];
  onSelectItem: (item: ItemType<ValueType>) => void;
}

const DropDown = ({ items, onSelectItem }: Props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<ValueType | null>(null);

  const updateValue = useCallback(() => {
    setValue(items[0].value);
  }, [items]);

  useEffect(() => {
    updateValue();
  }, [updateValue]);

  return (
    <DropDownPicker
      testID="dropdown"
      zIndex={10}
      multiple={false}
      setOpen={setOpen}
      setValue={setValue}
      open={open}
      listMode="SCROLLVIEW"
      value={value}
      style={{ borderRadius: 0 }}
      dropDownContainerStyle={{ borderRadius: 0 }}
      textStyle={[TextTheme.normal, { fontSize: 14 }]}
      ArrowDownIconComponent={() => (
        <Icon name="caretdown" size={10} color="#000FFF" />
      )}
      ArrowUpIconComponent={() => (
        <Icon name="caretup" size={10} color="#00DDDD" />
      )}
      items={items}
      onSelectItem={onSelectItem}
    />
  );
};

export default DropDown;
