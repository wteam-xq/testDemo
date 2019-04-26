## React 开发小总结；

* react 国际化，处理 input placeholder:
```
#参考网址：https://stackoverflow.com/questions/39630620/react-intl-how-to-use-formattedmessage-in-input-placeholder
<FormattedMessage id="input_key">
  {placeholder => (
    <input
      value="value"
      placeholder={placeholder}
      type="text"
    />
  )}
</FormattedMessage>
```